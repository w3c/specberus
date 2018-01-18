/**
 * Pseudo-rule for metadata extraction: deliverers' IDs.
 */

// 'self.name' would be 'metadata.deliverers'
exports.name = "metadata.deliverers";

exports.check = function(sr, done) {

    var ids = sr.getDelivererIDs();

    done({delivererIDs: ids});

};
