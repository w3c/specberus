/**
 * Check if there's a <em>back-top-top</em> hyperlink.
 */

import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'style.back-to-top',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const $candidates = context.$(
        "body p#back-to-top[role='navigation'] a[href='#title']"
    );

    if ($candidates.length !== 1) context.warning(self, 'not-found');
};
