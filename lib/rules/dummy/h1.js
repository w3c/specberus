
exports.name = "dummy.h1";
exports.check = function (sr, done) {
    sr.checkSelector("h1", this.name, done);
};
