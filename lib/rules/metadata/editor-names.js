/**
 * Pseudo-rule for metadata extraction: editor-names.
 */

// 'self.name' would be 'metadata.editor-names'
exports.name = "metadata.editor-names";

exports.check = function(sr, done) {
    var dl = sr.jsDocument.querySelector("body div.head dl")
    ,   dts = sr.extractHeaders(dl)
    ,   result = [];
    if (dts.Editor) {
        dts.Editor.dd.forEach(function (element) {
            var editor = element.textContent.trim().replace(/[,(].*$/, "").trim();
            if (editor) result.push(editor);
      });
    }
    return done({editorNames: result});
};
