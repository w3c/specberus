/**
 * Pseudo-rule for metadata extraction: process.
 */

// const self = {
//     name: 'metadata.process'
// ,   section: 'document-status'
// ,   rule: 'whichProcess'
// };

exports.name = "metadata.process";

exports.check = function(sr, done) {
    var $processDocument = sr.$('a#w3c_process_revision');
    if (!$processDocument || !$processDocument.attr('href')) {
        return done();
    }
    else
        return done({process: $processDocument.attr('href')});
};
