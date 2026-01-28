/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'headers.hr',
    section: 'front-matter',
    rule: 'hrAfterCopyright',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const hasHrLastChild = sr.$('body div.head > hr:last-child').length === 1;
    const hasHrNextSibling = sr.$('body div.head + hr').length === 1;
    if (hasHrLastChild && hasHrNextSibling) {
        sr.error(self, 'duplicate');
    } else if (!hasHrLastChild && !hasHrNextSibling) {
        sr.error(self, 'not-found');
    }
    done();
}
