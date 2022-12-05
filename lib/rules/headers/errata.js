// errata, right after dl

const self = {
    name: 'headers.errata',
};

export const { name } = self;

// Check if document is Recommendation, and uses inline changes(REC with Candidate/Proposed changes)
function isRECWithChanges(sr) {
    const isREC = sr.config.status === 'REC';
    if (!isREC) {
        return false;
    }

    const recMeta = sr.getRecMetadata({});
    return Object.values(recMeta).some(v => !!v);
}

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
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
}
