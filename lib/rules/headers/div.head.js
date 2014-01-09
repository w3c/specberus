
exports.name = "headers.div-head";
exports.check = function (sr, done) {
    sr.checkSelector("body > div.head:first-child", this.name, done);
};
