import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'validation.wcag',
    section: 'document-body',
    rule: 'wcag',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    context.info(self, 'tools');
};
