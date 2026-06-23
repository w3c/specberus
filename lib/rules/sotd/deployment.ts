// for CR and REC.

import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'sotd.deployment',
    section: 'document-status',
    rule: 'deployment',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const $sotd = context.getSotDSection();

    if ($sotd) {
        // Find the sentence of 'W3C recommends the wide deployment of this specification as a standard for the Web.'
        const depText =
            'W3C recommends the wide deployment of this specification as a standard for the Web.';
        const paragraph = $sotd
            .find('p')
            .toArray()
            .find(p => context.norm(context.$(p).text()) === depText);
        if (!paragraph) context.error(self, 'not-found');
    }
};
