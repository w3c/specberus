/**
 * Pseudo-rule for metadata extraction: editor-names.
 */

// 'self.name' would be 'metadata.editor-names'
exports.name = 'metadata.editor-names';

exports.check = function (sr, done) {
    const dl = sr.jsDocument.querySelector('body div.head dl');
    const dts = sr.extractHeaders(dl);
    const result = [];
    if (dts.Editor) {
        dts.Editor.dd.forEach((element) => {
            const editor = element.textContent
                .trim()
                .replace(/[,(].*$/, '')
                .trim();
            if (editor) result.push(editor);
        });
    }
    return done({ editorNames: result });
};
