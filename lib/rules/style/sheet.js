
exports.check = function (sr, cb) {
    var name = "style.sheet";
    if (!sr.config.styleSheet) {
        sr.sink.emit("ok", name);
        return cb();
    }
    var url = "http://www.w3.org/StyleSheets/TR/" + sr.config.styleSheet
    ,   sel = "head > link[rel=stylesheet][href='" + url + "']"
    ,   $lnk = sr.$(sel)
    ;
    if ($lnk.length) {
        // nextAll() doesn't work in whacko *cries*
        if (sr.$(sel + " ~ link[rel=stylesheet]").length)
            sr.sink.emit("err", name, { message: "W3C TR style sheet must be last." });
        else sr.sink.emit("ok", name);
    }
    else sr.sink.emit("err", name, { message: "Missing W3C TR style sheet." });
    cb();
};
