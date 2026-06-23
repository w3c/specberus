/**
 * Pseudo-rule for metadata extraction: errata.
 */

import type { RuleCheckFunction } from '../../types.js';

// 'self.name' would be 'metadata.errata'

export const name = 'metadata.errata';

interface ErrataMetadata {
    errata: string;
}

export const check: RuleCheckFunction<ErrataMetadata | void> = context => {
    const errataRegex = /errata/i;
    const $links = context.$('body div.head details + p > a');
    const errata = $links
        .toArray()
        .filter(el => errataRegex.test(context.$(el).text()));
    if (errata.length && errata[0].attribs.href)
        return { errata: errata[0].attribs.href };
};
