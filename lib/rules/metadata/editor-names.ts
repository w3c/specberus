/**
 * Pseudo-rule for metadata extraction: editor-names.
 */

import type { RuleCheckFunction } from '../../types.js';

// 'self.name' would be 'metadata.editor-names'
export const name = 'metadata.editor-names';

interface EditorNamesMetadata {
    editorNames: string[];
}

export const check: RuleCheckFunction<EditorNamesMetadata> = (sr, done) => {
    const dts = sr.extractHeaders();
    const editorNames: string[] = [];
    if (dts.Editor) {
        dts.Editor.$dd.each((_, el) => {
            const editor = sr
                .$(el)
                .text()
                .trim()
                .replace(/[,(].*$/, '')
                .trim();
            if (editor) editorNames.push(editor);
        });
    }
    return done({ editorNames });
};
