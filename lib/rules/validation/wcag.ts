import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'validation.wcag',
    section: 'document-body',
    rule: 'wcag',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    sr.info(self, 'tools');
    return done();
};
