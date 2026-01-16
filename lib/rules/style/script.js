/**
 * Check whether the script <code>fixup.js</code> is linked in the page.
 */

/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'style.script',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const PATTERN_SCRIPT =
        /^(https?:)?\/\/(www\.)?w3\.org\/scripts\/tr\/2021\/fixup\.js$/i;

    const $candidates = sr.$('script[src]');
    let found = 0;

    $candidates.each((_, el) => {
        if (PATTERN_SCRIPT.test(el.attribs.src)) {
            found += 1;
        }
    });

    if (found !== 1) {
        sr.error(self, 'not-found');
    }

    done();
}
