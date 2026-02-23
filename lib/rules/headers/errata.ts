// errata, right after dl

import type { RuleCheckFunction, RuleMeta } from '../../types.js';
import type { Specberus } from '../../validator.js';

const self: RuleMeta = {
    name: 'headers.errata',
    section: 'front-matter',
    rule: 'docIDOrder',
};

export const { name } = self;

// Check if document is Recommendation, and uses inline changes(REC with Candidate/Proposed changes)
function isRECWithChanges(sr: Specberus) {
    if (sr.config.status !== 'REC') {
        return false;
    }

    const recMeta = sr.getRecMetadata();
    return Object.values(recMeta).length !== 0;
}

export const check: RuleCheckFunction<void> = (sr, done) => {
    // for REC with Candidate/Proposed changes, no need to check errata link
    if (isRECWithChanges(sr)) {
        return done();
    }

    const dts = sr.extractHeaders();
    // Check 'Errata:' exist, don't check any further.
    if (!dts.Errata) {
        sr.error(self, 'no-errata');
        return done();
    }
    return done();
};
