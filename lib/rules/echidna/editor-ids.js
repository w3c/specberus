const self = {
    name: 'echidna.editor-ids'
,   section: 'front-matter'
    // @TODO: update this selector... when the rule is added to the JSON.
,   rule: 'editorSection'
};

exports.check = function (sr, done) {
    var editorIDs = sr.getEditorIDs();

    if (editorIDs.length === 0) sr.error(self, 'no-editor-id');

    done();
};
