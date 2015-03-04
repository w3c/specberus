'use strict';

exports.name = "echidna.editor-ids";

exports.check = function (sr, done) {
    var editorIDs = sr.$('dd[data-editor-id]').map(function(index, element) {
        var strId = sr.$(element).attr('data-editor-id');

        // If the ID is not a digit-only string, it gets filtered out
        if (/\d+/.test(strId)) return parseInt(strId, 10);
    });

    sr.metadata('editorIDs', editorIDs);

    if (editorIDs.length === 0) sr.error(exports.name, 'no-editor-id');

    done();
};
