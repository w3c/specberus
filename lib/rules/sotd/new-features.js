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
    const linkHrefOld =
        'https://www.w3.org/2023/Process-20231103/#allow-new-features';
    const linkHrefNew =
        'https://www.w3.org/policies/process/20231103/#allow-new-features';

    if (sotd && sr.norm(sotd.textContent).match(warning)) {
        const foundLink = Array.prototype.some.call(
            sotd.querySelectorAll('a'),
            a =>
                sr.norm(a.textContent) === linkTxt &&
                [linkHrefNew, linkHrefOld].includes(a.href)
        );
        if (!foundLink) {
            sr.error(self, 'no-link');
        }
    } else {
        sr.warning(self, 'no-warning');
    }
    done();
}
