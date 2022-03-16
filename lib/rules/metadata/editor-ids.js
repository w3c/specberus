/**
 * Pseudo-rule for metadata extraction: editor-ids.
 */

// 'self.name' would be 'metadata.editor-ids'
export const name = 'metadata.editor-ids';

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    return done({ editorIDs: sr.getEditorIDs() });
}
