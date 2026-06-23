/* check if the document's headers link are in */

import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'headers.details-summary',
    section: 'front-matter',
    rule: 'docIDFormat',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const $details = context.$('.head details').first();
    if (!$details.length) {
        context.error(self, 'no-details');
        return;
    }

    if (!$details.attr('open')) {
        context.error(self, 'no-details-open');
    }

    if (!context.$('.head details dl').length) {
        context.error(self, 'no-details-dl');
        return;
    }

    const $summary = context.$('.head details summary').first();
    if (!$summary.length) {
        context.error(self, 'no-details-summary');
        return;
    }

    const summaryText = context.norm($summary.text());
    if (summaryText !== 'More details about this document') {
        context.error(self, 'wrong-summary-text');
    }
};
