
exports.name = "headers.title";
exports.check = function (sr, done) {
    sr.checkSelector("head > title", this.name, done);
};
