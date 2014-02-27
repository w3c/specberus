
exports.name = "headers.div-head";
exports.check = function (sr, done) {
    sr.checkSelector("body div.head", this.name, done);
};
