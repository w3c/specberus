/**
 * Pseudo-rule for metadata extraction: editor-ids.
 */

const self = {
    name: 'metadata.editor-ids'
};

exports.check = function(sr, done) {
    return done({editorIDs: sr.getEditorIDs()});
};
