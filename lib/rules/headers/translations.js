
// translations, in .head
exports.name = "headers.translations";
exports.check = function (sr, done) {
    var $trans = sr.$("body div.head a:contains('translations')").first();
    if (!$trans || !$trans.length) {
        sr.error(exports.name, "not-found");
        return done();
    }

    var href = $trans.attr('href');
    sr.info(exports.name, "found", { link: href });
    if (sr.norm(href).indexOf("http://www.w3.org/2003/03/Translations/byTechnology?technology=") !== 0)
        sr.warning(exports.name, "not-recommended-link");

    done();
};
