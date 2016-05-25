const self = {
    name: 'sotd.cr-end'
};

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(self, "no-sotd");
        return done();
    }
    var txt = sr.norm($sotd.text())
    ,   rex = new RegExp("no earlier than " + sr.dateRegexStrNonCapturing + "\\.")
    ;
    if (!rex.test(txt)) sr.error(self, "not-found");
    done();
};
