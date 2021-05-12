/**
 * Pseudo-rule for metadata extraction: deliverers' IDs.
 */

// 'self.name' would be 'metadata.deliverers'
exports.name = 'metadata.deliverers';

exports.check = async function (sr, done) {
    const ids = await sr.getDelivererIDs();

    done({ delivererIDs: ids });
};
