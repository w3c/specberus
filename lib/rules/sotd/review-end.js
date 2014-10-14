
exports.name = "sotd.review-end";
exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }
    var txt = sr.norm($sotd.text())
    ,   rex = new RegExp(sr.dateRegexStrCapturing, "g")
    ;
    // XXX we want to make this an error, but there is no standard for the text.
    if (!rex.test(txt)) sr.warning(exports.name, "not-found");
    else {
        var matches = txt.match(rex);
        for (var i in matches) {
            if (sr.stringToDate(matches[i]) > sr.getDocumentDate()) {
                sr.info(exports.name, "found", { date : matches[i] });
                return done();
            }
        }
        sr.warning(exports.name, "not-found");
    }
    done();
};
