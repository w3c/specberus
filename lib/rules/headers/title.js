/* emits: 'not-found' */

const self = {
    name: 'headers.title'
,   section: 'front-matter'
,   rule: 'titleTest'
};

exports.check = function (sr, done) {
    sr.checkSelector("head > title", self, done);
};
