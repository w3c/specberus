// must have dl, with:
//  dts containing "This Version", "Latest Version", "Previous Version" in that order
//  this version is https://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is https://www.w3.org/TR/shortname/
//  h2 date and this version date must match
//  dt for editor or author

var PowerPromise = require('promise'),
    req = require('request'),
    { JSDOM } = require('jsdom');
const self = {
        name: 'headers.dl',
        section: 'front-matter',
        rule: 'docIDFormat',
    },
    thisError = {
        name: 'headers.dl',
        section: 'front-matter',
        rule: 'docIDThisVersion',
    },
    latestError = {
        name: 'headers.dl',
        section: 'front-matter',
        rule: 'docIDLatestVersion',
    },
    previousError = {
        name: 'headers.dl',
        section: 'front-matter',
        rule: 'docIDOrder',
    };
exports.name = self.name;

exports.check = function (sr, done) {
    var prevRequired = sr.config.previousVersion,
        rescinds = sr.config.rescinds,
        obsoletes = sr.config.obsoletes,
        supersedes = sr.config.supersedes,
        subType = sr.config.submissionType,
        topLevel = 'TR',
        thisURI = '',
        previousURI = '',
        latestURI = '';
    var fetch = function (uri) {
        return new PowerPromise(function (resolve, reject) {
            req.get(uri, {}, function (error, response, body) {
                if (error) {
                    reject(
                        new Error(
                            'Fetching ' +
                                uri +
                                ' triggered a network error: ' +
                                error.message
                        )
                    );
                } else if (response.statusCode !== 200) {
                    reject(
                        new Error(
                            'Fetching ' +
                                uri +
                                ' triggered an HTTP error: code ' +
                                response.statusCode
                        )
                    );
                } else resolve(body);
            });
        });
    };

    if (subType === 'member') topLevel = 'Submission';
    else if (subType === 'team') topLevel = 'TeamSubmission';

    var dts = sr.extractHeaders(
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

    var shortname,
        seriesShortname,
        matches,
        shortnameChange = false;

    if (dts.This) {
        var linkThis = dts.This.dd.querySelector('a');
        if (
            !linkThis ||
            linkThis.getAttribute('href').trim() !== linkThis.textContent.trim()
        )
            sr.error(self, 'this-link');

        var vThisRex =
            '^https:\\/\\/www\\.w3\\.org\\/' +
            topLevel +
            '\\/(\\d{4})\\/' +
            (sr.config.status || '[A-Z]+') +
            '-(.+)-(\\d{4})(\\d\\d)(\\d\\d)\\/?$';
        matches = (linkThis.getAttribute('href') || '')
            .trim()
            .match(new RegExp(vThisRex));
        var docDate = sr.getDocumentDate();
        if (matches) {
            thisURI = matches[0];
            var year = matches[1] * 1,
                year2 = matches[3] * 1,
                month = matches[4] * 1,
                day = matches[5] * 1;
            shortname = matches[2];
            const pattern = /-?\d[\d.]*$/,
                dashPattern = /\d[\d.]*-/;
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

    var sn;

    if (dts.Latest) {
        var linkLate = dts.Latest.dd.querySelector('a');
        if (
            !linkLate ||
            linkLate.getAttribute('href').trim() !== linkLate.textContent.trim()
        )
            sr.error(self, 'latest-link');

        var lateRex =
            '^https:\\/\\/www\\.w3\\.org\\/' + topLevel + '\\/(.+?)\\/?$';
        matches = (linkLate.getAttribute('href') || '')
            .trim()
            .match(new RegExp(lateRex));
        if (matches) {
            sn = matches[1];
            // latest version link can be the shortlink or the series shortlink
            if (sn === shortname) {
                latestURI = linkLate.textContent;
            } else if (sn === seriesShortname) {
                latestURI = 'https://www.w3.org/TR/' + shortname + '/';
            }
            if (sn !== shortname && sn !== seriesShortname)
                sr.error(self, 'this-latest-shortname');
        } else sr.error(latestError, 'latest-syntax');
    }

    if (dts.Previous) {
        var linkPrev = dts.Previous.dd.querySelector('a');
        if (
            !linkPrev ||
            linkPrev.getAttribute('href').trim() !== linkPrev.textContent.trim()
        )
            sr.error(self, 'previous-link');

        const prevRex = /^http(s?):\/\/www\.w3\.org\/TR\/\d{4}\/[A-Z]+-(.+)-(\d{8})\/$/;
        matches = (linkPrev.getAttribute('href') || '').trim().match(prevRex);
        if (matches) {
            if (matches[3] >= 20160801 && 's' !== matches[1])
                sr.error(previousError, 'previous-syntax');
            previousURI = linkPrev.textContent;
            shortnameChange = matches[2] !== shortname;
            if (shortnameChange) {
                sr.warning(self, 'this-previous-shortname');
            }
        } else sr.error(previousError, 'previous-syntax');
    }

    if (dts.Rescinds) {
        var linkResc = dts.Rescinds.dd.querySelector('a');
        if (!linkResc || linkResc.getAttribute('href') !== linkResc.textContent)
            sr.error(self, 'rescinds-link');

        matches = (linkResc.getAttribute('href') || '')
            .trim()
            .match(/^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/);
        if (matches) {
            sn = matches[1];
            if (sn !== shortname) sr.error(self, 'this-rescinds-shortname');
        } else sr.error(self, 'rescinds-syntax');
    }

    if (dts.Obsoletes) {
        var linkObsl = dts.Obsoletes.dd.querySelector('a');
        if (!linkObsl || linkObsl.getAttribute('href') !== linkObsl.textContent)
            sr.error(self, 'obsoletes-link');

        matches = (linkObsl.getAttribute('href') || '')
            .trim()
            .match(/^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/);
        if (matches) {
            sn = matches[1];
            if (sn !== shortname) sr.error(self, 'this-obsoletes-shortname');
        } else sr.error(self, 'obsoletes-syntax');
    }

    if (dts.Supersedes) {
        var linkSpsd = dts.Supersedes.dd.querySelector('a');
        if (!linkSpsd || linkSpsd.getAttribute('href') !== linkSpsd.textContent)
            sr.error(self, 'supersedes-link');

        matches = (linkSpsd.getAttribute('href') || '')
            .trim()
            .match(/^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/);
        if (matches) {
            sn = matches[1];
            if (sn !== shortname) sr.error(self, 'this-supersedes-shortname');
        } else sr.error(self, 'supersedes-syntax');
    }

    var needImple = ['CR', 'CRD', 'PR', 'REC'].indexOf(sr.config.status) !== -1;
    if (dts.Implementation) {
        var linkImple =
            dts.Implementation.dd.querySelector('a') &&
            dts.Implementation.dd.querySelector('a').href;
        if (needImple && !linkImple) sr.error(self, 'implelink-not-found');
        if (
            linkImple &&
            !linkImple.trim().toLowerCase().startsWith('https://')
        ) {
            sr.error(self, 'implelink-should-be-https', { link: linkImple });
        }
    } else if (needImple) {
        sr.error(self, 'implelink-not-found');
    }

    if (dts.EditorDraft) {
        var editorsDraft =
            dts.EditorDraft.dd.querySelector('a') &&
            dts.EditorDraft.dd.querySelector('a').href;
        if (
            editorsDraft &&
            !editorsDraft.trim().toLowerCase().startsWith('https://')
        ) {
            sr.error(self, 'editors-draft-should-be-https', {
                link: editorsDraft,
            });
        }
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
            function (bodies) {
                if (!bodies || 2 !== bodies.length) {
                    sr.error(self, 'cant-retrieve');
                } else if (bodies[0] !== bodies[1]) {
                    // check same day publication
                    var jsdom = new JSDOM(bodies[1]);
                    var jsDocument = jsdom.window.document;

                    var latestDl = jsDocument.querySelector('body div.head dl'),
                        latestDts = sr.extractHeaders(latestDl);
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
            function () {
                sr.error(self, 'cant-retrieve');
                done();
            }
        );
    }
};
