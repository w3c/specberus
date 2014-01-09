
exports.name = "dummy.h2-foo";
exports.check = function (sr, done) {
    sr.checkSelector("h2.foo", this.name, done);
};
