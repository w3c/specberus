
// translations, in .head
exports.name = "headers.translations";
exports.check = function (sr, done) {
    var TRANSLATION_REGEX = /https?:\/\/(www\.)?w3\.org\/2003\/03\/translations\/bytechnology\?technology=.+/ig;
    var $trans = sr.$("body div.head a:contains('translations')").first();
    if (!$trans || !$trans.length) {
        sr.error(exports.name, "not-found");
        return done();
    }

    var href = $trans.attr('href');
    sr.info(exports.name, "found", { link: href });
    if (!(sr.norm(href).match(TRANSLATION_REGEX)))
        sr.warning(exports.name, "not-recommended-link");

    done();
};
