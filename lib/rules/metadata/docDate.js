/**
 * Pseudo-rule for metadata extraction: docDate.
 */

// 'self.name' would be 'metadata.docDate'
exports.name = 'metadata.docDate';

exports.check = function (sr, done) {
    const docDate = sr.getDocumentDate();
    if (!docDate) {
        return done();
    }
    const d = [
        docDate.getFullYear(),
        docDate.getMonth() + 1,
        docDate.getDate(),
    ].join('-');
    return done({ docDate: d });
};
