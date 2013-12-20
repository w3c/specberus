
exports.check = function (sr, cb) {
    sr.checkSelector("h2.foo", "dummy.has-h2-foo", cb);
};
