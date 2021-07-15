/**
 * Pseudo-rule for metadata extraction: patent-policy.
 */

// 'self.name' would be 'metadata.patent-policy'

exports.name = 'metadata.patent-policy';

exports.check = async function (sr, done) {
    const { charters, patentPolicy } = await sr.getChartersAndPolicy();

    return done({ patentPolicy, charters });
};
