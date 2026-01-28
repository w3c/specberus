/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'sotd.new-features',
    section: 'document-status',
    rule: 'newFeatures',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $sotd = sr.getSotDSection();
    const docType = `${sr.config.status !== 'REC' ? 'upcoming ' : ''}Recommendation`;
    const warning = new RegExp(
        `Future updates to this ${docType} may incorporate new features.`
    );
    const linkTxt = 'new features';
    const linkHref =
        'https://www.w3.org/policies/process/20250818/#allow-new-features';

    if ($sotd && sr.norm($sotd.text()).match(warning)) {
        const foundLink = $sotd
            .find('a')
            .toArray()
            .some(
                a =>
                    sr.norm(sr.$(a).text()) === linkTxt &&
                    a.attribs.href === linkHref
            );
        if (!foundLink) {
            sr.error(self, 'no-link');
        }
    } else {
        sr.warning(self, 'no-warning');
    }
    done();
}
