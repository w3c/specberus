
exports.name = "style.sheet";
exports.check = function (sr, done) {
    if (!sr.config.styleSheet) return done();
    var url = "http://www.w3.org/StyleSheets/TR/" + sr.config.styleSheet
    ,   sel = "head > link[rel=stylesheet][href='" + url + "']"
    ,   $lnk = sr.$(sel)
    ;
    if ($lnk.length) {
        // nextAll() doesn't work in whacko *cries*
        if (sr.$(sel + " ~ link[rel=stylesheet]").length)
            sr.sink.emit("err", this.name, { message: "W3C TR style sheet must be last." });
    }
    else sr.sink.emit("err", this.name, { message: "Missing W3C TR style sheet." });
    done();
};
