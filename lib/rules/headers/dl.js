// must have dl, with:
//  dts containing "This Version", "Latest Version", "Previous Version" in that order
//  this version is https://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is https://www.w3.org/TR/shortname/
//  #w3c-state date and this version date must match
//  dt for editor or author

/** @import { CheerioAPI } from "cheerio" */
/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'docIDFormat',
};
const thisError = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'docIDThisVersion',
};
const latestError = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'docIDLatestVersion',
};
const historyError = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'docIDHistory',
};
const editorError = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'editorSection',
};
export const name = self.name;

/**
 * Check if link and href are consistent.
 * @param {Object} object place to find <a>, current error message title when there is error.
 * @param {Specberus} object.sr
 * @param {ReturnType<CheerioAPI>} object.$element
 * @returns boolean whether element exists and can continue
 */
function checkLink({ sr, rule = self, $element, linkName, mustHave = true }) {
    if (!$element?.length || !$element.attr('href')) {
        if (mustHave)
            sr.error(rule, 'not-found', { linkName, message: linkName });
        return false;
    }
    const text = sr.norm($element.text()).trim();
    const href = $element.attr('href').trim();
    if (href !== text) sr.error(rule, 'link-diff', { text, href, linkName });
    return true;
}

/**
 * @param {Specberus} sr
 * @param done
 */
export async function check(sr, done) {
    const { rescinds } = sr.config;
    const subType = sr.config.submissionType;
    let topLevel = 'TR';
    let thisURI = '';

    if (subType === 'member') topLevel = 'submissions';

    const dts = sr.extractHeaders();
    if (!dts.This) sr.error(self, 'this-version');
    if (!dts.Latest) sr.error(self, 'latest-version');
    if (!dts.History) sr.error(self, 'no-history');
    if (rescinds && !dts.Rescinds) sr.error(self, 'rescinds');
    if (!rescinds && dts.Rescinds) sr.warning(self, 'rescinds-not-needed');

    if (dts.This && dts.Latest && dts.This.pos > dts.Latest.pos)
        sr.error(self, 'this-latest-order');
    // TODO: What's the order for History?
    if (dts.Latest && dts.Rescinds && dts.Latest.pos > dts.Rescinds.pos)
        sr.error(self, 'latest-rescinds-order');

    let matches;

    if (dts.This) {
        const $linkThis = dts.This.$dd.find('a');
        const exist = checkLink({
            sr,
            rule: self,
            $element: $linkThis,
            linkName: 'This version',
        });

        if (exist) {
            const vThisRex = `^https:\\/\\/www\\.w3\\.org\\/${topLevel}\\/(\\d{4})\\/${
                sr.config.status || '[A-Z]+'
            }-(.+)-(\\d{4})(\\d\\d)(\\d\\d)\\/?$`;
            matches = ($linkThis.attr('href') || '')
                .trim()
                .match(new RegExp(vThisRex));
            const docDate = sr.getDocumentDate();
            if (matches) {
                [thisURI] = matches;
                const year = matches[1] * 1;
                const year2 = matches[3] * 1;
                const month = matches[4] * 1;
                const day = matches[5] * 1;
                if (docDate) {
                    if (
                        year !== docDate.getFullYear() ||
                        year2 !== docDate.getFullYear() ||
                        month - 1 !== docDate.getMonth() ||
                        day !== docDate.getDate()
                    )
                        sr.error(self, 'this-date');
                } else sr.warning(self, 'no-date');
            } else sr.error(thisError, 'this-syntax');
        }
    }

    if (dts.Latest) {
        const $linkLate = dts.Latest.$dd.find('a');
        const exist = checkLink({
            sr,
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
                sr.error(latestError, 'latest-syntax');
            }
        }
    }

    if (dts.History) {
        const $linkHistory = dts.History.$dd.find('a');
        checkLink({
            sr,
            rule: historyError,
            $element: $linkHistory,
            linkName: 'History',
        });
    }

    if (dts.Rescinds) {
        const $linkRescinds = dts.Rescinds.$dd.find('a');
        const exist = checkLink({
            sr,
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
                sr.error(self, 'rescinds-syntax');
            }
        }
    }

    // check "Implementation report" link. Unless in Sotd saying there's none.
    const needImplementation =
        ['CR', 'CRD', 'PR', 'REC'].indexOf(sr.config.status) !== -1;
    const $sotd = sr.getSotDSection();
    const noImplementation =
        sr
            .norm($sotd && $sotd.text())
            .indexOf('There is no preliminary implementation report.') > -1;
    const $linkImplementation =
        dts.Implementation && dts.Implementation.$dd.find('a');
    const implementationExist = checkLink({
        sr,
        rule: self,
        $element: $linkImplementation,
        linkName: 'Implementation report',
        mustHave: noImplementation ? false : needImplementation,
    });
    if (
        implementationExist &&
        !$linkImplementation
            .attr('href')
            .trim()
            .toLowerCase()
            .startsWith('https://')
    ) {
        sr.error(self, 'implelink-should-be-https', {
            link: $linkImplementation.attr('href'),
        });
    }
    if (noImplementation && needImplementation) {
        sr.warning(self, 'implelink-confirm-no');
    }

    // check "Editor's draft" link
    if (dts.EditorDraft) {
        const $editorsDraftElement = dts.EditorDraft.$dd.find('a');
        const exist = checkLink({
            sr,
            rule: self,
            $element: $editorsDraftElement,
            linkName: 'Implementation report',
        });
        if (exist) {
            const editorsDraft = $editorsDraftElement.attr('href');
            if (!editorsDraft.trim().toLowerCase().startsWith('https://'))
                sr.error(self, 'editors-draft-should-be-https', {
                    link: editorsDraft,
                });
        }
    }

    if (dts.Editor && dts.Editor.$dd.length) {
        // 'missingElement' is array of HTML elements without editorId
        const missingElement = dts.Editor.$dd.toArray().filter(
            editor =>
                !editor.attribs['data-editor-id'] &&
                !sr
                    .$(editor)
                    .text()
                    .match(/(working|interest) group/i)
        );
        if (missingElement.length) {
            sr.error(editorError, 'editor-missing-id', {
                names: missingElement
                    .map(editor => sr.$(editor).text())
                    .join(', '),
            });
        }
    } else {
        // should at least have 1 editor
        sr.error(editorError, 'editor-not-found');
    }

    done();
}
