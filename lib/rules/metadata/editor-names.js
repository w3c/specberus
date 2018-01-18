/**
 * Pseudo-rule for metadata extraction: editor-names.
 */

// 'self.name' would be 'metadata.editor-names'
exports.name = "metadata.editor-names";

exports.check = function(sr, done) {
    var $dl = sr.$("body div.head dl").first()
    ,   dts = sr.extractHeaders($dl)
    ,   result = [];
    if (dts.Editor) {
      dts.Editor.dd.each(function() {
          var editor = sr.$(this).text().trim().replace(/[,(].*$/, "").trim();
          if (editor) result.push(editor);
      });
    }
    return done({editorNames: result});
};
