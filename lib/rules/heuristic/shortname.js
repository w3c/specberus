const req = require('request');

const self = {
    name: 'heuristic.shortname',
    section: 'front-matter',
    rule: 'docIDLatestVersion',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const subType = sr.config.submissionType;
    let topLevel = 'TR';
    if (subType === 'member') topLevel = 'Submission';
    else if (subType === 'team') topLevel = 'TeamSubmission';

    const dts = sr.extractHeaders();
    const linkLate = dts.Latest ? dts.Latest.dd.querySelector('a') : null;
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
        const isFP = sr.isFP();
        if (shortname && isFP) {
            req.head(linkLateHref, {}, (error, response) => {
                if (error) {
                    sr.error(self, 'error-request', {
                        shortlink: linkLateHref,
                        error,
                    });
                } else if (
                    response.statusCode !== 404 ||
                    response.statusCode !== 300
                ) {
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
