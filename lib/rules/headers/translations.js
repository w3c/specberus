// translations, in .head

const self = {
    name: 'headers.translations'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var TRANSLATION_REGEX = /https:\/\/(www\.)?w3\.org\/(2003\/03\/translations\/bytechnology\?technology=.+|2005\/11\/Translations\/Query\?.+)/ig;
    var $trans = sr.$("body div.head a:contains('translations')").first();
    if (!$trans || !$trans.length) {
        sr.error(self, "not-found");
        return done();
    }

    var href = $trans.attr('href');
    sr.info(self, "found", { link: href });
    if (!(sr.norm(href).match(TRANSLATION_REGEX)))
        sr.warning(self, "not-recommended-link");

    done();
};
