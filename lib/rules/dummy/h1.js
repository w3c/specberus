/* emits: 'not-found' */

const self = {
    name: 'dummy.h1'
};

exports.check = function (sr, done) {
    sr.checkSelector("h1", self, done);
};
