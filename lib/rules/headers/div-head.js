/* emits: 'not-found' */

const self = {
    name: 'headers.div-head',
    section: 'front-matter',
    rule: 'divClassHead',
};

exports.name = self.name;

exports.check = function (sr, done) {
    sr.checkSelector('body div.head', self, done);
};
