/* emits: 'not-found' */

const self = {
    name: 'headers.div-head'
,   section: 'front-matter'
,   rule: 'divClassHeadTest'
};

exports.check = function (sr, done) {
    sr.checkSelector("body div.head", self, done);
};
