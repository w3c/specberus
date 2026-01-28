/**
 * Pseudo-rule for metadata extraction: editor-names.
 */

/** @import { Specberus } from "../../validator.js" */

// 'self.name' would be 'metadata.editor-names'
export const name = 'metadata.editor-names';

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const dts = sr.extractHeaders();
    const result = [];
    if (dts.Editor) {
        dts.Editor.$dd.each((_, el) => {
            const editor = sr
                .$(el)
                .text()
                .trim()
                .replace(/[,(].*$/, '')
                .trim();
            if (editor) result.push(editor);
        });
    }
    return done({ editorNames: result });
}
