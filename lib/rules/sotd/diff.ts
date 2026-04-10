import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'sotd.diff',
    section: 'document-status',
    rule: 'changesList',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    sr.info(self, 'note');
    return done();
};
