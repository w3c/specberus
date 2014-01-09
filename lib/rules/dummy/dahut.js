
exports.name = "dummy.dahut";
exports.check = function (sr, done) {
    sr.checkSelector("#bar > section.inner p[data-foo]:contains('DAHUT')", this.name, done);
};
