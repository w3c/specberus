
exports.check = function (sr, cb) {
    sr.checkSelector("head > title", "headers.title", cb);
};
