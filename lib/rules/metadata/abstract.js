/**
 * Pseudo-rule for metadata extraction: abstract.
 */

import { load } from 'cheerio';

/** @import { CheerioAPI } from "cheerio" */
/** @import { Specberus } from "../../validator.js" */

export const name = 'metadata.abstract';

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    /** @type {ReturnType<CheerioAPI>} */
    let $abstractTitle;
    sr.$('h2').each((_, el) => {
        const $el = sr.$(el);
        if (sr.norm($el.text()).toLowerCase() === 'abstract') {
            $abstractTitle = $el;
            return false;
        }
    });

    if ($abstractTitle) {
        const $div = load('<div></div>', null, false)('div');
        $abstractTitle
            .parent()
            .children()
            .each((_, child) => {
                {
                    if (child !== $abstractTitle[0]) {
                        $div.append(child.cloneNode(true));
                    }
                }
            });
        return done({ abstract: sr.norm($div.html()) });
    } else {
        return done({ abstract: 'Not found' });
    }
}
