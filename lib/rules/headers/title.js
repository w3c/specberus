
exports.check = function (sr, cb) {
    sr.checkSelector("head > title", "validation.has-title", cb);
};
