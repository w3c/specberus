import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'sotd.deliverer-note',
    section: 'metadata',
    rule: 'delivererID',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    const deliverers = sr.getDataDelivererIDs();

    if (deliverers.length === 0) sr.error(self, 'not-found');
    done();
};
