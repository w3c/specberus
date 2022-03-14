/**
 * Pseudo-rule for metadata extraction: patent-policy.
 */

// 'self.name' would be 'metadata.patent-policy'

export const name = 'metadata.patent-policy';

/**
 * @param sr
 * @param done
 */
export async function check(sr, done) {
    const patentPolicies = await sr.getPatentPolicies();
    return done({ patentPolicy: patentPolicies[0] });
}
