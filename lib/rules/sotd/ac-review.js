
exports.name = "sotd.ac-review";
exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }
    var found = false;
    $sotd.find("a[href*='www.w3.org/2002/09/wbs/']").each(function() {
        var href = sr.$(this).attr("href");
        found = true;
        // XXX use an <a href> to display the link
        sr.warning(exports.name, "found", { link : href });
        return;
    });
    if (!found) sr.error(exports.name, "not-found");
    done();
};
