import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'sotd.diff',
    section: 'document-status',
    rule: 'changesList',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    sr.info(self, 'note');
    return done();
};
