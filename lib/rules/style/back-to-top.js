/**
 * Check if there's a <em>back-top-top</em> hyperlink.
 */

/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'style.back-to-top',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $candidates = sr.$(
        "body p#back-to-top[role='navigation'] a[href='#title']"
    );

    if ($candidates.length !== 1) {
        sr.warning(self, 'not-found');
    }

    done();
}
