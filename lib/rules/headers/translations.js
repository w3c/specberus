
// translations, in .head
exports.name = "headers.translations";
exports.check = function (sr, done) {
    var $trans;
    sr.$("body > div.head:first-child p").each(function () {
        var $p = sr.$(this);
        if (sr.norm($p.text()) === "See also translations.") {
            $trans = $p;
            return false;
        }
    });
    if (!$trans || !$trans.length) {
        sr.error(exports.name, "not-found");
        return done();
    }
    var $a = $trans.find("a[href]");
    
    if (!$a.length || !$a.find("strong").length ||
        sr.norm($a.text()) !== "translations" ||
        sr.norm($a.attr("href")).indexOf("http://www.w3.org/2003/03/Translations/byTechnology?technology=") !== 0)
            sr.error(exports.name, "not-found");

    done();
};
