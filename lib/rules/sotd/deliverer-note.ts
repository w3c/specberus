import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'sotd.deliverer-note',
    section: 'metadata',
    rule: 'delivererID',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const deliverers = context.getDataDelivererIDs();
    if (deliverers.length === 0) context.error(self, 'not-found');
};
