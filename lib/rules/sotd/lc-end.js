
exports.name = "sotd.lc-end";
exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }
    var txt = sr.norm($sotd.text())
    ,   rex = new RegExp("The Last Call period ends " + sr.dateRegexStrNonCapturing + "\\.")
    ;
    if (!rex.test(txt)) sr.warning(exports.name, "not-found");
    done();
};
