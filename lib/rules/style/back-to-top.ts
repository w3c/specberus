/**
 * Check if there's a <em>back-top-top</em> hyperlink.
 */

import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'style.back-to-top',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    const $candidates = sr.$(
        "body p#back-to-top[role='navigation'] a[href='#title']"
    );

    if ($candidates.length !== 1) sr.warning(self, 'not-found');

    done();
};
