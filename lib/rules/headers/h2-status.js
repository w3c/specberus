
exports.check = function (sr, cb) {
    var name = "headers.h2-status";
    if (!sr.config.longStatus) {
        sr.sink.emit("ok", name);
        return cb();
    }
    var $h2 = sr.getDocumentDateElement();
    if (!$h2 || !$h2.length) sr.sink.emit("err", name, { message: "No status+date h2 element." });
    var txt = sr.norm($h2.text());
    if (txt.indexOf("W3C " + sr.config.longStatus) === 0) sr.sink.emit("ok", name);
    else sr.sink.emit("err", name, { message: "Incorrect status h2 header." });
    cb();
};
