exports.name = "echidna.editor-ids";

exports.check = function (sr, done) {
    var editorIDs = sr.getEditorIDs();

    if (editorIDs.length === 0) sr.error(exports.name, 'no-editor-id');

    done();
};
