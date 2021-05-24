const req = require('request');
const util = require('../../util');

const self = {
    name: 'heuristic.shortname',
    section: 'front-matter',
    rule: 'docIDLatestVersion',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const dl = sr.jsDocument.querySelector('body div.head dl');
    const subType = sr.config.submissionType;
    let topLevel = 'TR';
    if (subType === 'member') topLevel = 'Submission';
    else if (subType === 'team') topLevel = 'TeamSubmission';

    const extractLatestURI = function (dl) {
        let latestAnchor;
        if (dl) {
            dl.querySelectorAll('dt').forEach((dt) => {
                const txt = sr
                    .norm(dt.textContent)
                    .replace(':', '')
                    .toLowerCase()
                    .replace('published ', '');
                const dd = util.next(dt, 'dd');
                if (txt.lastIndexOf('latest version', 0) === 0)
                    latestAnchor = dd && dd.querySelector('a');
            });
            return latestAnchor;
        }
    };

    const linkLate = extractLatestURI(dl);
    if (linkLate && linkLate.getAttribute('href') !== '') {
        const linkLateHref = linkLate.getAttribute('href');
        const lateRex = `^https?:\\/\\/www\\.w3\\.org\\/${topLevel}\\/(.+?)\\/?$`;
        const matches = linkLateHref.trim().match(new RegExp(lateRex));
        let shortname = '';
        if (matches) {
            [, shortname] = matches;
            sr.metadata('shortname', shortname);
        }

        // make sure FPWD doesn't use a shortname that exists.
        const isFP =
            sr.config.longStatus &&
            sr.config.longStatus.startsWith('First Public');
        if (shortname && isFP) {
            req.get(linkLateHref, {}, (error, response) => {
                if (error) {
                    sr.error(self, 'error-request');
                } else if (response.statusCode === 200) {
                    sr.error(self, 'shortname-duplicate', { shortname });
                }
                return done();
            });
        } else {
            return done();
        }
    } else {
        sr.error(self, 'latest-link');
        return done();
    }
};
