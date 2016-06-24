/**
 * Pseudo-rule for metadata extraction: editor-names.
 */

// 'self.name' would be 'metadata.editor-names'

exports.check = function(sr, done) {
    var $dl = sr.$("body div.head dl").first()
    ,   dts = sr.extractHeaders($dl)
    ,   result = [];
    if (dts.Editor) {
      dts.Editor.dd.each(function(d) {
          var editor = sr.$(this).text().trim();
          result.push(editor.substring(0, editor.indexOf(',')));
      });
    }
    return done({editorNames: result});
};
