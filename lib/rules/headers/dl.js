// must have dl, with:
//  dts containing "This Version", "Latest Version", "Previous Version" in that order
//  this version is https://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is https://www.w3.org/TR/shortname/
//  h2 date and this version date must match
//  dt for editor or author

const PowerPromise = require('promise');
const req = require('request');
const { JSDOM } = require('jsdom');

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
const previousError = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'docIDOrder',
};
const editorError = {
    name: 'headers.dl',
    section: 'front-matter',
    rule: 'editorSection',
};
exports.name = self.name;

/**
 * Check if link and href are consistant.
 * @param {} Object place to find <a>, current error message title when there is error.
 * @returns boolean whether element exists and can continue
 */
function checkLink({ sr, rule = self, element, linkName, mustHave = true }) {
    if (!element || !element.href) {
        if (mustHave) sr.error(rule, 'not-found', { linkName });
        return false;
    }
    const text = element.textContent.trim();
    const href = element.href.trim();
    if (href !== text) sr.error(rule, 'link-diff', { text, href, linkName });
    return true;
}

exports.check = function (sr, done) {
    const prevRequired = sr.config.previousVersion;
    const { rescinds } = sr.config;
    const { obsoletes } = sr.config;
    const { supersedes } = sr.config;
    const subType = sr.config.submissionType;
    let topLevel = 'TR';
    let thisURI = '';
    let previousURI = '';
    let latestURI = '';
    const fetch = function (uri) {
        return new PowerPromise((resolve, reject) => {
            req.get(uri, {}, (error, response, body) => {
                if (error) {
                    reject(
                        new Error(
                            `Fetching ${uri} triggered a network error: ${error.message}`
                        )
                    );
                } else if (response.statusCode !== 200) {
                    reject(
                        new Error(
                            `Fetching ${uri} triggered an HTTP error: code ${response.statusCode}`
                        )
                    );
                } else resolve(body);
            });
        });
    };

    if (subType === 'member') topLevel = 'Submission';
    else if (subType === 'team') topLevel = 'TeamSubmission';

    const dts = sr.extractHeaders(
        sr.jsDocument.querySelector('body div.head dl')
    );
    if (!dts.This) sr.error(self, 'this-version');
    if (!dts.Latest) sr.error(self, 'latest-version');
    if (prevRequired && !dts.Previous) sr.error(self, 'previous-version');
    if (!prevRequired && dts.Previous) sr.warning(self, 'previous-not-needed');
    if (rescinds && !dts.Rescinds) sr.error(self, 'rescinds');
    if (!rescinds && dts.Rescinds) sr.warning(self, 'rescinds-not-needed');
    if (obsoletes && !dts.Obsoletes) sr.error(self, 'obsoletes');
    if (!obsoletes && dts.Obsoletes) sr.warning(self, 'obsoletes-not-needed');
    if (supersedes && !dts.Supersedes) sr.error(self, 'supersedes');
    if (!supersedes && dts.Supersedes)
        sr.warning(self, 'supersedes-not-needed');

    if (dts.This && dts.Latest && dts.This.pos > dts.Latest.pos)
        sr.error(self, 'this-latest-order');
    if (dts.Latest && dts.Previous && dts.Latest.pos > dts.Previous.pos)
        sr.error(self, 'latest-previous-order');
    if (dts.Latest && dts.Rescinds && dts.Latest.pos > dts.Rescinds.pos)
        sr.error(self, 'latest-rescinds-order');
    if (dts.Latest && dts.Obsoletes && dts.Latest.pos > dts.Obsoletes.pos)
        sr.error(self, 'latest-obsoletes-order');
    if (dts.Latest && dts.Supersedes && dts.Latest.pos > dts.Supersedes.pos)
        sr.error(self, 'latest-supersedes-order');

    let shortname;
    let seriesShortname;
    let matches;
    let shortnameChange = false;

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
                thisURI = matches[0];
                const year = matches[1] * 1;
                const year2 = matches[3] * 1;
                const month = matches[4] * 1;
                const day = matches[5] * 1;
                shortname = matches[2];
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

    if (dts.Previous) {
        const linkPrev = dts.Previous.dd.querySelector('a');
        const exist = checkLink({
            sr,
            rule: self,
            element: linkPrev,
            linkName: 'Previous version',
        });

        if (exist) {
            const prevRex =
                /^https:\/\/www\.w3\.org\/TR\/\d{4}\/[A-Z]+-(.+)-(\d{8})\/$/;
            matches = (linkPrev.getAttribute('href') || '')
                .trim()
                .match(prevRex);
            if (matches) {
                previousURI = linkPrev.textContent;
                shortnameChange = matches[1] !== shortname;
                if (shortnameChange) {
                    sr.warning(self, 'this-previous-shortname', {
                        previousShortname: matches[1],
                        thisShortname: shortname,
                    });
                }
            } else sr.error(previousError, 'previous-syntax');
        }
    }

    if (dts.Rescinds) {
        const linkResc = dts.Rescinds.dd.querySelector('a');
        const exist = checkLink({
            sr,
            rule: self,
            element: linkResc,
            linkName: 'Rescinds this Recommendation',
        });
        if (exist) {
            matches = (linkResc.getAttribute('href') || '')
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
    const needImple =
        ['CR', 'CRD', 'PR', 'REC'].indexOf(sr.config.status) !== -1;
    const sotd = sr.getSotDSection();
    const noImple =
        sr
            .norm(sotd && sotd.textContent)
            .indexOf('There is no preliminary implementation report.') > -1;
    const linkImple =
        dts.Implementation && dts.Implementation.dd.querySelector('a');
    const impleExist = checkLink({
        sr,
        rule: self,
        element: linkImple,
        linkName: 'Implementation report',
        mustHave: noImple ? false : needImple,
    });
    if (
        impleExist &&
        !linkImple.href.trim().toLowerCase().startsWith('https://')
    ) {
        sr.error(self, 'implelink-should-be-https', { link: linkImple });
    }
    if (noImple && needImple) {
        sr.warning(self, 'implelink-comfirm-no');
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

    if (
        thisURI &&
        previousURI &&
        thisURI.toLowerCase() === previousURI.toLowerCase()
    ) {
        sr.error(self, 'same-this-and-previous');
    }

    if (
        !previousURI ||
        !latestURI ||
        previousURI.toLowerCase() === latestURI.toLowerCase() ||
        shortnameChange
    ) {
        done();
    } else {
        PowerPromise.all([fetch(previousURI), fetch(latestURI)]).then(
            bodies => {
                if (!bodies || bodies.length !== 2) {
                    sr.error(self, 'cant-retrieve');
                } else if (bodies[0] !== bodies[1]) {
                    // check same day publication
                    const jsdom = new JSDOM(bodies[1]);
                    const jsDocument = jsdom.window.document;

                    const latestDl =
                        jsDocument.querySelector('body div.head dl');
                    const latestDts = sr.extractHeaders(latestDl);
                    if (
                        latestDts.This &&
                        latestDts.This.dd.querySelector('a') &&
                        latestDts.This.dd.querySelector('a').href === thisURI &&
                        latestDts.Previous &&
                        latestDts.Previous.dd.querySelector('a') &&
                        latestDts.Previous.dd.querySelector('a').href ===
                            previousURI
                    ) {
                        sr.warning(self, 'same-day-publication');
                    } else {
                        sr.error(self, 'latest-is-not-previous');
                    }
                }
                done();
            },
            () => {
                sr.error(self, 'cant-retrieve');
                done();
            }
        );
    }
};
