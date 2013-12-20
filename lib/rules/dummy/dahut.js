
exports.check = function (sr, cb) {
    sr.checkSelector("#bar > section.inner p[data-foo]:contains('DAHUT')", "dummy.dahut", cb);
};
