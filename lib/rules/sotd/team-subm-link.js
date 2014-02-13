
exports.name = "sotd.team-subm-link";
exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }
    var $a = $sotd.find("a[href='http://www.w3.org/TeamSubmission/']");
    if (!$a.length) sr.error(exports.name, "no-link");
    done();
};


