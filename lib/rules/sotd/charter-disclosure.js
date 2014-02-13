
exports.name = "sotd.charter-disclosure";
exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }
    var txt = sr.norm($sotd.text());
    if (!/The disclosure obligations of the Participants of this group are described in the charter\./.test(txt))
        sr.error(exports.name, "not-found");
    done();
};
