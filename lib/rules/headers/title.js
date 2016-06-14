/* emits: 'not-found' */

const self = {
    name: 'headers.title'
,   section: 'front-matter'
,   rule: 'title'
};

exports.check = function (sr, done) {
    sr.checkSelector("head > title", self, done);
};
