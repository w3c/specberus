'use strict';

exports.name = "echidna.editor-ids";

exports.check = function (sr, done) {
    var editorIDs = sr.getEditorIDs();

    sr.metadata('editorIDs', editorIDs);

    if (editorIDs.length === 0) sr.error(exports.name, 'no-editor-id');

    done();
};
