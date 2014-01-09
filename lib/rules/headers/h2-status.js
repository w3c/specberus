
exports.name = "headers.h2-status";
exports.check = function (sr, done) {
    if (!sr.config.longStatus) return done();
    var $h2 = sr.getDocumentDateElement();
    if (!$h2 || !$h2.length) sr.sink.emit("err", this.name, { message: "No status+date h2 element." });
    var txt = sr.norm($h2.text());
    if (txt.indexOf("W3C " + sr.config.longStatus) !== 0)
        sr.sink.emit("err", this.name, { message: "Incorrect status h2 header." });
    done();
};
