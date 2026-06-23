// for Registry.

import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'sotd.usage',
    section: 'document-status',
    rule: 'usage',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const $sotd = context.getSotDSection();

    if ($sotd) {
        // Find the sentence of 'W3C recommends the wide usage of this registry.'
        const usageText = 'W3C recommends the wide usage of this registry.';
        const paragraph = $sotd
            .find('p')
            .toArray()
            .find(p => context.norm(context.$(p).text()) === usageText);
        if (!paragraph) context.error(self, 'not-found');
    }
};
