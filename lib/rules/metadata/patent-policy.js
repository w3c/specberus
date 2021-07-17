/**
 * Pseudo-rule for metadata extraction: patent-policy.
 */

// 'self.name' would be 'metadata.patent-policy'

exports.name = 'metadata.patent-policy';

exports.check = async function (sr, done) {
    const patentPolicies = await sr.getPatentPolicies();

    return done({ patentPolicy: patentPolicies[0] });
};
