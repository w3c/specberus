/**
 * Pseudo-rule for metadata extraction: charters.
 */

// 'self.name' would be 'metadata.charters'

exports.name = 'metadata.charters';

exports.check = async function (sr, done) {
    const charters = await sr.getCharters();

    return done({ charters });
};
