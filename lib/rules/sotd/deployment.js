// for CR and REC.

/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'sotd.deployment',
    section: 'document-status',
    rule: 'deployment',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $sotd = sr.getSotDSection();

    if ($sotd) {
        // Find the sentence of 'W3C recommends the wide deployment of this specification as a standard for the Web.'
        const depText =
            'W3C recommends the wide deployment of this specification as a standard for the Web.';
        const paragraph = $sotd
            .find('p')
            .toArray()
            .find(p => sr.norm(sr.$(p).text()) === depText);
        if (!paragraph) {
            sr.error(self, 'not-found');
            return done();
        }
    }
    return done();
}
