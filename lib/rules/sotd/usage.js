// for Registry.

/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'sotd.usage',
    section: 'document-status',
    rule: 'usage',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $sotd = sr.getSotDSection();

    if ($sotd) {
        // Find the sentence of 'W3C recommends the wide usage of this registry.'
        const usageText = 'W3C recommends the wide usage of this registry.';
        const paragraph = $sotd
            .find('p')
            .toArray()
            .find(p => sr.norm(sr.$(p).text()) === usageText);
        if (!paragraph) {
            sr.error(self, 'not-found');
            return done();
        }
    }
    return done();
}
