/**
 * Pseudo-rule for metadata extraction: docDate.
 */

exports.name = 'metadata.docDate';

exports.check = function(sr, done) {

    var docDate = sr.getDocumentDate();
    if (!docDate) {
        return done();
    }
    var d = [docDate.getFullYear(), docDate.getMonth() + 1, docDate.getDate()].join('-');
    return done({docDate: d});
};
