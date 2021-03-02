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
        const lateRex = `^https?:\\/\\/www\\.w3\\.org\\/${topLevel}\\/(.+?)\\/?$`;
        const matches = (linkLate.getAttribute('href') || '')
            .trim()
            .match(new RegExp(lateRex));
        if (matches) {
            const sn = matches[1];
            sr.metadata('shortname', sn);
        }
    } else sr.error(self, 'latest-link');

    return done();
};
