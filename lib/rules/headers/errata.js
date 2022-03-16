// errata, right after dl

const self = {
    name: 'headers.errata',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const dts = sr.extractHeaders();
    // Check 'Errata:' exist, don't check any further.
    if (!dts.Errata) {
        sr.error(self, 'no-errata');
        return done();
    }
    return done();
}
