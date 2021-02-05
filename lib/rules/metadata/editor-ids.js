/**
 * Pseudo-rule for metadata extraction: editor-ids.
 */

// 'self.name' would be 'metadata.editor-ids'
exports.name = 'metadata.editor-ids';

exports.check = function (sr, done) {
    return done({ editorIDs: sr.getEditorIDs() });
};
