/**
 * Pseudo-rule for metadata extraction: errata.
 */

/** @import { Specberus } from "../../validator.js" */

// 'self.name' would be 'metadata.errata'

export const name = 'metadata.errata';

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const errataRegex = /errata/i;
    const $links = sr.$('body div.head details + p > a');
    const errata = $links
        .toArray()
        .filter(el => errataRegex.test(sr.$(el).text()));
    if (!errata.length || !errata[0].attribs.href) done();
    else done({ errata: errata[0].attribs.href });
}
