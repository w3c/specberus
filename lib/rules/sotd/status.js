const self = {
    name: 'sotd.status'
};

exports.check = function (sr, done) {
    if (!sr.config.sotdStatus) return done();
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(self, "no-sotd");
        return done();
    }
    if (!sr.norm($sotd.text()).match(new RegExp(sr.config.longStatus)))
        sr.error(self, "no-mention", { status: sr.config.longStatus });
    done();
};
