const self = {
    name: 'sotd.new-features',
    section: 'document-status',
    rule: 'newFeatures',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const sotd = sr.getSotDSection();
    const docType =
        sr.config.status === 'PR' ? 'specification' : 'Recommendation';
    const warning = new RegExp(
        `Future updates to this ${docType} may incorporate new features.`
    );
    const linkTxt = 'new features';
    const linkHref =
        'https://www.w3.org/policies/process/202508XX/#allow-new-features';

    if (sotd && sr.norm(sotd.textContent).match(warning)) {
        const foundLink = Array.prototype.some.call(
            sotd.querySelectorAll('a'),
            a => sr.norm(a.textContent) === linkTxt && a.href === linkHref
        );
        if (!foundLink) {
            sr.error(self, 'no-link');
        }
    } else {
        sr.warning(self, 'no-warning');
    }
    done();
}
