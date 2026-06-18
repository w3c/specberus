// errata, right after dl

import type { RuleCheckFunction, RuleMeta } from '../../types.js';
import type { RuleContext } from '../../rule-context.js';

const self: RuleMeta = {
    name: 'headers.errata',
    section: 'front-matter',
    rule: 'docIDOrder',
};

export const { name } = self;

// Check if document is Recommendation, and uses inline changes(REC with Candidate/Proposed changes)
function isRECWithChanges(context: RuleContext) {
    if (context.config!.status !== 'REC') return false;

    const recMeta = context.getRecMetadata();
    return Object.values(recMeta).length !== 0;
}

export const check: RuleCheckFunction = context => {
    // for REC with Candidate/Proposed changes, no need to check errata link
    if (isRECWithChanges(context)) return;

    const dts = context.extractHeaders();
    // Check 'Errata:' exist, don't check any further.
    if (!dts.Errata) context.error(self, 'no-errata');
};
