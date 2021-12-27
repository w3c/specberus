/* eslint-disable */

// must have dl, with:
//  dts containing "This Version", "Latest Version", "Previous Version" in that order
//  this version is https://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is https://www.w3.org/TR/shortname/
//  #w3c-state date and this version date must match
//  dt for editor or author

const superagent = require('superagent');

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
exports.name = self.name;

/**
 * Check if link and href are consistent.
 * @param {} Object place to find <a>, current error message title when there is error.
 * @returns boolean whether element exists and can continue
 */
function checkLink({ sr, rule = self, element, linkName, mustHave = true }) {
    if (!element || !element.href) {
        if (mustHave) sr.error(rule, 'not-found', { linkName });
        return false;
    }
    const text = sr.norm(element.textContent).trim();
    const href = element.href.trim();
    if (href !== text) sr.error(rule, 'link-diff', { text, href, linkName });
    return true;
}

exports.check = async function (sr, done) {
    const { rescinds } = sr.config;
    const { obsoletes } = sr.config;
    const { supersedes } = sr.config;
    const subType = sr.config.submissionType;
    let topLevel = 'TR';
    let thisURI = '';
    let latestURI = '';

    if (subType === 'member') topLevel = 'Submission';
    else if (subType === 'team') topLevel = 'TeamSubmission';

    const dts = sr.extractHeaders();
    if (!dts.This) sr.error(self, 'this-version');
    if (!dts.Latest) sr.error(self, 'latest-version');
    if (!dts.History) sr.error(self, 'no-history');
    if (rescinds && !dts.Rescinds) sr.error(self, 'rescinds');
    if (!rescinds && dts.Rescinds) sr.warning(self, 'rescinds-not-needed');
    if (obsoletes && !dts.Obsoletes) sr.error(self, 'obsoletes');
    if (!obsoletes && dts.Obsoletes) sr.warning(self, 'obsoletes-not-needed');
    if (supersedes && !dts.Supersedes) sr.error(self, 'supersedes');
    if (!supersedes && dts.Supersedes)
        sr.warning(self, 'supersedes-not-needed');

    if (dts.This && dts.Latest && dts.This.pos > dts.Latest.pos)
        sr.error(self, 'this-latest-order');
    // TODO: What's the order for History?
    if (dts.Latest && dts.Rescinds && dts.Latest.pos > dts.Rescinds.pos)
        sr.error(self, 'latest-rescinds-order');
    if (dts.Latest && dts.Obsoletes && dts.Latest.pos > dts.Obsoletes.pos)
        sr.error(self, 'latest-obsoletes-order');
    if (dts.Latest && dts.Supersedes && dts.Latest.pos > dts.Supersedes.pos)
        sr.error(self, 'latest-supersedes-order');

    let shortname;
    let seriesShortname;
    let matches;

    if (dts.This) {
        const linkThis = dts.This.dd.querySelector('a');
        const exist = checkLink({
            sr,
            rule: self,
            element: linkThis,
            linkName: 'This version',
        });

        if (exist) {
            const vThisRex = `^https:\\/\\/www\\.w3\\.org\\/${topLevel}\\/(\\d{4})\\/${
                sr.config.status || '[A-Z]+'
            }-(.+)-(\\d{4})(\\d\\d)(\\d\\d)\\/?$`;
            matches = (linkThis.getAttribute('href') || '')
                .trim()
                .match(new RegExp(vThisRex));
            const docDate = sr.getDocumentDate();
            if (matches) {
                [thisURI] = matches;
                const year = matches[1] * 1;
                const year2 = matches[3] * 1;
                const month = matches[4] * 1;
                const day = matches[5] * 1;
                [, , shortname] = matches;
                const pattern = /-?\d[\d.]*$/;
                const dashPattern = /\d[\d.]*-/;
                seriesShortname = shortname
                    .replace(pattern, '')
                    .replace(dashPattern, '-');
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

    let sn;

    if (dts.Latest) {
        const linkLate = dts.Latest.dd.querySelector('a');
        const exist = checkLink({
            sr,
            rule: self,
            element: linkLate,
            linkName: 'Latest published version',
        });

        if (exist) {
            const lateRex = `^https:\\/\\/www\\.w3\\.org\\/${topLevel}\\/(.+?)\\/?$`;
            matches = (linkLate.getAttribute('href') || '')
                .trim()
                .match(new RegExp(lateRex));
            if (matches) {
                sn = matches[1];
                // latest version link can be the shortlink or the series shortlink
                if (sn === shortname) {
                    latestURI = linkLate.textContent;
                } else if (sn === seriesShortname) {
                    latestURI = `https://www.w3.org/TR/${shortname}/`;
                }
                if (sn !== shortname && sn !== seriesShortname)
                    sr.error(self, 'this-latest-shortname', {
                        thisShortname: shortname,
                        latestShortname: sn,
                    });
            } else sr.error(latestError, 'latest-syntax');
        }
    }

    if (dts.History) {
        const linkHistory = dts.History.dd.querySelector('a');
        const exist = checkLink({
            sr,
            rule: historyError,
            element: linkHistory,
            linkName: 'History',
        });
        if (exist) {
            // e.g. https://www.w3.org/standards/history/hr-time-10086
            const historyReg =
                /^https:\/\/www\.w3\.org\/standards\/history\/(.+)$/;
            matches = (linkHistory.getAttribute('href') || '')
                .trim()
                .match(historyReg);
            if (matches) {
                const [, historyShortname] = matches;
                if (historyShortname !== shortname) {
                    sr.error(historyError, 'history-syntax', { shortname });
                } else {
                    const historyHref = linkHistory.getAttribute('href');
                    // Check if the history link exist
                    let historyStatusCode;
                    const doAsync = require('doasync');
                    try {
                        const res = await doAsync(superagent).get(historyHref);
                        historyStatusCode = res.statusCode;
                    } catch (err) {
                        historyStatusCode = err.status;
                    }
                    var hasPreviousVersion = !(await sr.isFP());
                    if (hasPreviousVersion && historyStatusCode === 404) {
                        // it's a none FP spec, but the history page doesn't exist. There should be a 'valid' previous-shortname.
                        const previousShortname = linkHistory.getAttribute(
                            'data-previous-shortname'
                        );
                        if (previousShortname) {
                            // prettier-ignore
                            sr.warning(historyError, 'this-previous-shortname',
                                {
                                    previousShortname,
                                    thisShortname: shortname,
                                }
                            );

                            // check previous shortname is valid.
                            const previousHistoryHref = `https://www.w3.org/standards/history/${previousShortname}`;
                            let previousHistoryStatusCode;
                            try {
                                const res = await doAsync(superagent).get(
                                    previousHistoryHref
                                );
                                previousHistoryStatusCode = res.statusCode;
                            } catch (err) {
                                previousHistoryStatusCode = err.status;
                            }

                            if (previousHistoryStatusCode === 404) {
                                sr.error(historyError, 'history-bad-previous', {
                                    previousShortname,
                                    url: previousHistoryHref,
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    if (dts.Rescinds) {
        const linkRescinds = dts.Rescinds.dd.querySelector('a');
        const exist = checkLink({
            sr,
            rule: self,
            element: linkRescinds,
            linkName: 'Rescinds this Recommendation',
        });
        if (exist) {
            matches = (linkRescinds.getAttribute('href') || '')
                .trim()
                .match(
                    /^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/
                );
            if (matches) {
                sn = matches[1];
                if (sn !== shortname)
                    sr.error(self, 'this-rescinds-shortname', {
                        rescindsShortname: sn,
                        thisShortname: shortname,
                    });
            } else sr.error(self, 'rescinds-syntax');
        }
    }

    if (dts.Obsoletes) {
        const linkObsl = dts.Obsoletes.dd.querySelector('a');
        const exist = checkLink({
            sr,
            rule: self,
            element: linkObsl,
            linkName: 'Obsoletes this Recommendation',
        });
        if (exist) {
            matches = (linkObsl.getAttribute('href') || '')
                .trim()
                .match(
                    /^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/
                );
            if (matches) {
                sn = matches[1];
                if (sn !== shortname)
                    sr.error(self, 'this-obsoletes-shortname', {
                        obsoletesShortname: sn,
                        thisShortname: shortname,
                    });
            } else sr.error(self, 'obsoletes-syntax');
        }
    }

    if (dts.Supersedes) {
        const linkSpsd = dts.Supersedes.dd.querySelector('a');
        const exist = checkLink({
            sr,
            rule: self,
            element: linkSpsd,
            linkName: 'Supersedes this Recommendation',
        });

        if (exist) {
            matches = (linkSpsd.getAttribute('href') || '')
                .trim()
                .match(
                    /^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/
                );
            if (matches) {
                sn = matches[1];
                if (sn !== shortname)
                    sr.error(self, 'this-supersedes-shortname');
            } else sr.error(self, 'supersedes-syntax');
        }
    }

    // check "Implementation report" link. Unless in Sotd saying there's none.
    const needImplementation =
        ['CR', 'CRD', 'PR', 'REC'].indexOf(sr.config.status) !== -1;
    const sotd = sr.getSotDSection();
    const noImplementation =
        sr
            .norm(sotd && sotd.textContent)
            .indexOf('There is no preliminary implementation report.') > -1;
    const linkImplementation =
        dts.Implementation && dts.Implementation.dd.querySelector('a');
    const implementationExist = checkLink({
        sr,
        rule: self,
        element: linkImplementation,
        linkName: 'Implementation report',
        mustHave: noImplementation ? false : needImplementation,
    });
    if (
        implementationExist &&
        !linkImplementation.href.trim().toLowerCase().startsWith('https://')
    ) {
        sr.error(self, 'implelink-should-be-https', {
            link: linkImplementation,
        });
    }
    if (noImplementation && needImplementation) {
        sr.warning(self, 'implelink-confirm-no');
    }

    // check "Editor's draft" link
    if (dts.EditorDraft) {
        const editorsDraftElement = dts.EditorDraft.dd.querySelector('a');
        const exist = checkLink({
            sr,
            rule: self,
            element: editorsDraftElement,
            linkName: 'Implementation report',
        });
        if (exist) {
            const editorsDraft = editorsDraftElement.href;
            if (!editorsDraft.trim().toLowerCase().startsWith('https://'))
                sr.error(self, 'editors-draft-should-be-https', {
                    link: editorsDraft,
                });
        }
    }

    if (dts.Editor && dts.Editor.dd && dts.Editor.dd.length) {
        const editors = dts.Editor.dd;
        // 'missingElement' is array of HTML elements without editorId
        const missingElement = editors.filter(
            editor => !editor.dataset.editorId
        );
        if (missingElement.length) {
            sr.error(editorError, 'editor-missing-id', {
                names: missingElement
                    .map(editor => editor.textContent)
                    .join(', '),
            });
        }
    } else {
        // should at least have 1 editor
        sr.error(editorError, 'editor-not-found');
    }

    done();
};
