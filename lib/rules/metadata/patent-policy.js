/**
 * Pseudo-rule for metadata extraction: patent-policy.
 */

// 'self.name' would be 'metadata.patent-policy'

exports.name = 'metadata.patent-policy';

exports.check = async function (sr, done) {
    const { charters, patentPolicy } = await sr.getChartersAndPolicy();

    // TODO: joint-publication with different publication? https://github.com/w3c/specberus/issues/1319
    return done({ patentPolicy, charters });
};
