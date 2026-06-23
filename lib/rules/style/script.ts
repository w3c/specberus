/**
 * Check whether the script <code>fixup.js</code> is linked in the page.
 */

import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'style.script',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const PATTERN_SCRIPT =
        /^(https?:)?\/\/(www\.)?w3\.org\/scripts\/tr\/2021\/fixup\.js$/i;

    const $candidates = context.$('script[src]');
    let found = 0;

    $candidates.each((_, el) => {
        if (PATTERN_SCRIPT.test(el.attribs.src)) found++;
    });

    if (found !== 1) context.error(self, 'not-found');
};
