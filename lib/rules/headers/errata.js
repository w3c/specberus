// errata, right after dl

const self = {
    name: 'headers.errata',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const dts = sr.extractHeaders();
    // Check 'Errata:' exist, don't check any further.
    if (!dts.Errata) {
        sr.error(self, 'no-errata');
        return done();
    }
    return done();
};
