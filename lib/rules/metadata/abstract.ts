/**
 * Pseudo-rule for metadata extraction: abstract.
 */

import { load } from 'cheerio';
import type { RuleCheckFunction } from '../../types.js';

export const name = 'metadata.abstract';

export const check: RuleCheckFunction<{ abstract: string }> = (sr, done) => {
    const abstractHeadingEl = sr.$('h2').toArray().find((el) =>
        sr.norm(sr.$(el).text()).toLowerCase() === 'abstract');

    if (abstractHeadingEl) {
        const $div = load('<div></div>', null, false)('div');
        sr.$(abstractHeadingEl)
            .parent()
            .children()
            .each((_, child) => {
                {
                    if (child !== abstractHeadingEl) {
                        $div.append(child.cloneNode(true));
                    }
                }
            });
        return done({ abstract: sr.norm($div.html()!) });
    } else {
        return done({ abstract: 'Not found' });
    }
};
