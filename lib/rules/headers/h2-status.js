
exports.name = "headers.h2-status";
exports.check = function (sr, done) {
    if (!sr.config.longStatus) return done();
    var $h2 = sr.getDocumentDateElement();
    if (!$h2 || !$h2.length) sr.error(this.name, "no-h2");
    var txt = sr.norm($h2.text());
    if (txt.indexOf("W3C " + sr.config.longStatus) !== 0)
        sr.error(this.name, "bad-h2");
    done();
};
