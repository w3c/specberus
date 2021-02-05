const util = require('../../util');
const self = {
    name: 'heuristic.shortname',
    section: 'front-matter',
    rule: 'docIDLatestVersion',
};

exports.name = self.name;

exports.check = function (sr, done) {
    var dl = sr.jsDocument.querySelector('body div.head dl');
    var subType = sr.config.submissionType;
    var topLevel = 'TR';
    if (subType === 'member') topLevel = 'Submission';
    else if (subType === 'team') topLevel = 'TeamSubmission';

    var extractLatestURI = function (dl) {
        var latestAnchor;
        if (dl) {
            dl.querySelectorAll('dt').forEach(function (dt) {
                var txt = sr
                    .norm(dt.textContent)
                    .replace(':', '')
                    .toLowerCase()
                    .replace('published ', '');
                var dd = util.next(dt, 'dd');
                if (txt.lastIndexOf('latest version', 0) === 0)
                    latestAnchor = dd && dd.querySelector('a');
            });
            return latestAnchor;
        }
    };

    var linkLate = extractLatestURI(dl);
    if (linkLate && linkLate.getAttribute('href') !== '') {
        var lateRex =
            '^https?:\\/\\/www\\.w3\\.org\\/' + topLevel + '\\/(.+?)\\/?$';
        var matches = (linkLate.getAttribute('href') || '')
            .trim()
            .match(new RegExp(lateRex));
        if (matches) {
            var sn = matches[1];
            sr.metadata('shortname', sn);
        }
    } else sr.error(self, 'latest-link');

    return done();
};
