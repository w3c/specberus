// XXX link to linkchecker but should use another service (see https://github.com/w3c/specberus/issues/27)
exports.name = "links.linkchecker";
exports.check = function (sr, done) {
    sr.warning(exports.name, "display", { link : sr.url })
    done();
};
