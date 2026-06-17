// must have dl, with:
//  dts containing "This Version", "Latest Version", "Previous Version" in that order
//  this version is https://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is https://www.w3.org/TR/shortname/
//  #w3c-state date and this version date must match
//  dt for editor or author

import type { Cheerio } from 'cheerio';
import type { Element } from 'domhandler';

import type { RuleCheckFunction, RuleMeta } from '../../types.js';
import { resolveGithubUsernameToId } from '../../util.js';
import type { RuleContext } from '../../validator.js';

const self: RuleMeta = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'docIDFormat',
};
const thisError: RuleMeta = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'docIDThisVersion',
};
const latestError: RuleMeta = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'docIDLatestVersion',
};
const historyError: RuleMeta = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'docIDHistory',
};
const editorError: RuleMeta = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'editorSection',
};
export const name = self.name;

interface CheckLinkOptions {
    $element: Cheerio<Element>;
    linkName: string;
    mustHave?: boolean;
    rule?: RuleMeta;
    context: RuleContext;
}

/**
 * Check if link and href are consistent.
 * @returns boolean whether element exists and can continue
 */
function checkLink({
    context,
    rule = self,
    $element,
    linkName,
    mustHave = true,
}: CheckLinkOptions) {
    if (!$element?.length || !$element.attr('href')) {
        if (mustHave)
            context.error(rule, 'not-found', { linkName, message: linkName });
        return false;
    }
    const text = context.norm($element.text()).trim();
    const href = ($element.attr('href') || '').trim();
    if (href !== text)
        context.error(rule, 'link-diff', { text, href, linkName });
    return true;
}

export const check: RuleCheckFunction = async context => {
    const { rescinds, status, submissionType } = context.config!;
    let topLevel = 'TR';

    if (submissionType === 'member') topLevel = 'submissions';

    const dts = context.extractHeaders();
    if (!dts.This) context.error(self, 'this-version');
    if (!dts.Latest) context.error(self, 'latest-version');
    if (!dts.History) context.error(self, 'no-history');
    if (rescinds && !dts.Rescinds) context.error(self, 'rescinds');
    if (!rescinds && dts.Rescinds) context.warning(self, 'rescinds-not-needed');

    if (dts.This && dts.Latest && dts.This.pos > dts.Latest.pos)
        context.error(self, 'this-latest-order');
    // TODO: What's the order for History?
    if (dts.Latest && dts.Rescinds && dts.Latest.pos > dts.Rescinds.pos)
        context.error(self, 'latest-rescinds-order');

    let matches;

    if (dts.This) {
        const $linkThis = dts.This.$dd.find('a').first();
        const exist = checkLink({
            context,
            rule: self,
            $element: $linkThis,
            linkName: 'This version',
        });

        if (exist) {
            const vThisRex = `^https:\\/\\/www\\.w3\\.org\\/${topLevel}\\/(\\d{4})\\/${
                status || '[A-Z]+'
            }-(.+)-(\\d{4})(\\d\\d)(\\d\\d)\\/?$`;
            matches = ($linkThis.attr('href') || '')
                .trim()
                .match(new RegExp(vThisRex));
            const docDate = context.getDocumentDate();
            if (matches) {
                const year = +matches[1];
                const year2 = +matches[3];
                const month = +matches[4];
                const day = +matches[5];
                if (docDate) {
                    if (
                        year !== docDate.getFullYear() ||
                        year2 !== docDate.getFullYear() ||
                        month - 1 !== docDate.getMonth() ||
                        day !== docDate.getDate()
                    )
                        context.error(self, 'this-date');
                } else context.warning(self, 'no-date');
            } else context.error(thisError, 'this-syntax');
        }
    }

    if (dts.Latest) {
        const $linkLate = dts.Latest.$dd.find('a').first();
        const exist = checkLink({
            context,
            rule: self,
            $element: $linkLate,
            linkName: 'Latest published version',
        });

        if (exist) {
            const lateRex = `^https:\\/\\/www\\.w3\\.org\\/${topLevel}\\/(.+?)\\/?$`;
            matches = ($linkLate.attr('href') || '')
                .trim()
                .match(new RegExp(lateRex));

            if (!matches) {
                context.error(latestError, 'latest-syntax');
            }
        }
    }

    if (dts.History) {
        const $linkHistory = dts.History.$dd.find('a').first();
        checkLink({
            context,
            rule: historyError,
            $element: $linkHistory,
            linkName: 'History',
        });
    }

    if (dts.Rescinds) {
        const $linkRescinds = dts.Rescinds.$dd.find('a').first();
        const exist = checkLink({
            context,
            rule: self,
            $element: $linkRescinds,
            linkName: 'Rescinds this Recommendation',
        });

        if (exist) {
            matches = ($linkRescinds.attr('href') || '')
                .trim()
                .match(
                    /^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/
                );

            if (!matches) {
                context.error(self, 'rescinds-syntax');
            }
        }
    }

    // check "Implementation report" link. Unless in Sotd saying there's none.
    const needImplementation =
        ['CR', 'CRD', 'PR', 'REC'].indexOf(status) !== -1;
    const $sotd = context.getSotDSection();
    const noImplementation =
        context
            .norm(($sotd && $sotd.text()) || '')
            .indexOf('There is no preliminary implementation report.') > -1;
    const $linkImplementation =
        dts.Implementation && dts.Implementation.$dd.find('a').first();
    const implementationExist = checkLink({
        context,
        rule: self,
        $element: $linkImplementation,
        linkName: 'Implementation report',
        mustHave: noImplementation ? false : needImplementation,
    });
    if (
        implementationExist &&
        !($linkImplementation.attr('href') || '')
            .trim()
            .toLowerCase()
            .startsWith('https://')
    ) {
        context.error(self, 'implelink-should-be-https', {
            link: $linkImplementation.attr('href') || '',
        });
    }
    if (noImplementation && needImplementation) {
        context.warning(self, 'implelink-confirm-no');
    }

    // check "Editor's draft" link
    if (dts.EditorDraft) {
        const $editorsDraftElement = dts.EditorDraft.$dd.find('a').first();
        const exist = checkLink({
            context,
            rule: self,
            $element: $editorsDraftElement,
            linkName: 'Implementation report',
        });
        if (exist) {
            const editorsDraft = $editorsDraftElement.attr('href') || '';
            if (!editorsDraft.trim().toLowerCase().startsWith('https://'))
                context.error(self, 'editors-draft-should-be-https', {
                    link: editorsDraft,
                });
        }
    }

    if (dts.Editor && dts.Editor.$dd.length) {
        const missingElements = dts.Editor.$dd.toArray().filter(
            editor =>
                !editor.attribs['data-editor-id'] &&
                !editor.attribs['data-editor-github'] &&
                !context
                    .$(editor)
                    .text()
                    .match(/(working|interest) group/i)
        );
        if (missingElements.length) {
            context.error(editorError, 'editor-missing-id', {
                names: missingElements
                    .map(editor => context.$(editor).text())
                    .join(', '),
            });
        }

        const githubUsernames = dts.Editor.$dd
            .toArray()
            .filter(el => el.attribs['data-editor-github'])
            .map(el => el.attribs['data-editor-github']);

        const unresolvedUsernames: string[] = [];
        for (const username of githubUsernames) {
            try {
                if (!(await resolveGithubUsernameToId(username)))
                    unresolvedUsernames.push(username);
            } catch (error) {
                context.error(editorError, 'editor-github-failed', {
                    name: error.cause,
                });
            }
        }
        if (unresolvedUsernames.length) {
            context.error(editorError, 'editor-github-unresolvable', {
                names: unresolvedUsernames.join(', '),
            });
        }
    } else {
        // should at least have 1 editor
        context.error(editorError, 'editor-not-found');
    }
};
