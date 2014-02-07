
// must have h1, with same content as title

exports.name = "headers.h1-title";
exports.check = function (sr, done) {
    var $title = sr.$("head > title").first()
    ,   $h1 = sr.$("body > div.head:first-child h1").first()
    ;
    if (!$title.length || !$h1.length || $title.text() !== $h1.text())
        sr.error(this.name, "title");
    done();
};
