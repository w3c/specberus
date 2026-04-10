/* emits: 'not-found' */

import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'headers.div-head',
    section: 'front-matter',
    rule: 'divClassHead',
};

export const { name } = self;

export const check: RuleCheckFunction<void> = (sr, done) => {
    sr.checkSelector('body div.head', self, done);
};
