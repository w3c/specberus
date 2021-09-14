// for 'Group Note' and 'Group Draft Note', check 'Group Notes are not endorsed by the W3C nor its Membership.'
const self = {
    name: 'sotd.note-not-endorsed',
    section: 'document-status',
    rule: 'note-not-endorsed',
};

// TODO: doc and test
exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();

    if (
        sotd &&
        (sr.config.longStatus === 'Group Note' ||
            sr.config.longStatus === 'Group Draft Note')
    ) {
        // Find the sentence of 'Group Notes are not endorsed by the W3C nor its Membership.'
        const Text = `${sr.config.longStatus}s are not endorsed by the W3C nor its Membership.`;
        const [paragraph] = Array.prototype.filter.call(
            sotd.querySelectorAll('p'),
            paragraph => sr.norm(paragraph.textContent) === Text
        );
        if (!paragraph) {
            sr.error(self, 'not-found');
            return done();
        }
    }
    return done();
};
