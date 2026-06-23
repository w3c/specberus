/**
 * Pseudo-rule for metadata extraction: abstract.
 */

import { load } from 'cheerio';
import type { RuleCheckFunction } from '../../types.js';

export const name = 'metadata.abstract';

export const check: RuleCheckFunction<{ abstract: string }> = context => {
    const abstractHeadingEl = context
        .$('h2')
        .toArray()
        .find(
            el =>
                context.norm(context.$(el).text()).toLowerCase() === 'abstract'
        );

    if (!abstractHeadingEl) return { abstract: 'Not found' };

    const $div = load('<div></div>', null, false)('div');
    context
        .$(abstractHeadingEl)
        .parent()
        .children()
        .each((_, child) => {
            {
                if (child !== abstractHeadingEl)
                    $div.append(child.cloneNode(true));
            }
        });
    return { abstract: context.norm($div.html()!) };
};
