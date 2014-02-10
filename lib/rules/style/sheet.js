
exports.name = "style.sheet";
exports.check = function (sr, done) {
    if (!sr.config.styleSheet) return done();
    var url = "//www.w3.org/StyleSheets/TR/" + sr.config.styleSheet
    ,   sel = "head > link[rel=stylesheet][href='" + url + "'], " +
              "head > link[rel=stylesheet][href='http:" + url + "'], " +
              "head > link[rel=stylesheet][href='https:" + url + "']"
    ,   $lnk = sr.$(sel)
    ;
    if ($lnk.length) {
        // nextAll() doesn't work in whacko *cries*
        if (sr.$(sel + " ~ link[rel=stylesheet]").length)
            sr.error(this.name, "last");
    }
    else sr.error(this.name, "not-found");
    done();
};
