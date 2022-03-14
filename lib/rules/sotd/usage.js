// for Registry.
const self = {
    name: 'sotd.usage',
    section: 'document-status',
    rule: 'usage',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const sotd = sr.getSotDSection();

    if (sotd) {
        // Find the sentence of 'W3C recommends the wide usage of this registry.'
        const usageText = 'W3C recommends the wide usage of this registry.';
        const [paragraph] = Array.prototype.filter.call(
            sotd.querySelectorAll('p'),
            paragraph => sr.norm(paragraph.textContent) === usageText
        );
        if (!paragraph) {
            sr.error(self, 'not-found');
            return done();
        }
    }
    return done();
}
