/* emits: 'not-found' */

const self = {
    name: 'dummy.dahut'
};

exports.name = self.name;

exports.check = function (sr, done) {
    sr.checkSelector("#bar > section.inner p[data-foo]", self, done);
};
