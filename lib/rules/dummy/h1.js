/* emits: 'not-found' */

const self = {
    name: 'dummy.h1'
};

exports.name = self.name;

exports.check = function (sr, done) {
    sr.checkSelector("h1", self, done);
};
