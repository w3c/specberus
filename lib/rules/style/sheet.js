
exports.name = "style.sheet";
exports.check = function (sr, done) {
    if (!sr.config.styleSheet) return done();
    var url = "//www.w3.org/StyleSheets/TR/" + sr.config.styleSheet
    ,   sels = [
                "head > link[rel=stylesheet][href='" + url + "']"
            ,   "head > link[rel=stylesheet][href='http:" + url + "']"
            ,   "head > link[rel=stylesheet][href='https:" + url + "']"
            ,   "head > link[rel=stylesheet][href='" + url + ".css']"
            ,   "head > link[rel=stylesheet][href='http:" + url + ".css']"
            ,   "head > link[rel=stylesheet][href='https:" + url + ".css']"
        ]
    ,   $lnk = sr.$(sels.join(", "))
    ;
    if ($lnk.length) {
        // console.log("found", sr.$(sel + " ~ link[rel=stylesheet]"));
        // nextAll() doesn't work in whacko *cries*
        if (sr.$(sels.map(function (s) { return s + " ~ link[rel=stylesheet]"; }).join(", ")).length)
            sr.error(this.name, "last");
    }
    else sr.error(this.name, "not-found");
    done();
};
