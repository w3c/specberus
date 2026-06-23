import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'headers.hr',
    section: 'front-matter',
    rule: 'hrAfterCopyright',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const hasHrLastChild =
        context.$('body div.head > hr:last-child').length === 1;
    const hasHrNextSibling = context.$('body div.head + hr').length === 1;
    if (hasHrLastChild && hasHrNextSibling) {
        context.error(self, 'duplicate');
    } else if (!hasHrLastChild && !hasHrNextSibling) {
        context.error(self, 'not-found');
    }
};
