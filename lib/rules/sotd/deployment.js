// for CR and REC.
const self = {
    name: 'sotd.deployment',
    section: 'document-status',
    rule: 'deployment',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();

    if (sotd) {
        // Find the sentence of 'W3C recommends the wide deployment of this specification as a standard for the Web.'
        const depText =
            'W3C recommends the wide deployment of this specification as a standard for the Web.';
        const [paragraph] = Array.prototype.filter.call(
            sotd.querySelectorAll('p'),
            paragraph => sr.norm(paragraph.textContent) === depText
        );
        if (!paragraph) {
            sr.error(self, 'not-found');
            return done();
        }
    }
    return done();
};
