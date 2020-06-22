const self = {
    name: 'sotd.status'
};

exports.name = self.name;

exports.check = function (sr, done) {
    if (!sr.config.sotdStatus) return done();
    var sotd = sr.getSotDSection();
    if (sotd && sotd.list.length && !sr.norm(sotd.element.textContent).match(new RegExp(sr.config.longStatus)))
        sr.error(self, "no-mention", { status: sr.config.longStatus });
    done();
};
