/**
 * Pseudo-rule for metadata extraction: editor-ids.
 */

import type { RuleCheckFunction } from '../../types.js';
import { resolveGithubUsernameToId } from '../../util.js';

const self = {
    name: 'metadata.editor-ids',
    section: 'front-matter',
    rule: 'editorSection',
};

// 'self.name' would be 'metadata.editor-ids'
export const { name } = self;

interface EditorIDsMetadata {
    editorIDs: number[];
}

export const check: RuleCheckFunction<EditorIDsMetadata> = async (sr, done) => {
    const dts = sr.extractHeaders();
    const editorIds: number[] = [];
    const unresolvedUsernames = [];
    if (dts.Editor) {
        for (const el of dts.Editor.$dd.toArray()) {
            const editorId = el.attribs['data-editor-id'];
            // Return ID as number, if the ID is not a digit-only string, it gets filtered out
            if (editorId) editorIds.push(parseInt(editorId, 10));
            else {
                const editorGithub = el.attribs['data-editor-github'];
                if (editorGithub) {
                    try {
                        const id =
                            await resolveGithubUsernameToId(editorGithub);
                        if (id) editorIds.push(id);
                        else unresolvedUsernames.push(editorGithub);
                    } catch (error) {
                        sr.error(self, 'editor-github-failed', {
                            name: error.cause,
                        });
                    }
                }
            }
        }
        if (unresolvedUsernames.length) {
            sr.error(self, 'editor-github-unresolvable', {
                names: unresolvedUsernames,
            });
        }

        // remove duplicates
        done({
            editorIDs: editorIds.filter(
                (item, pos) => editorIds.indexOf(item) === pos
            ),
        });
    } else {
        done({ editorIDs: [] });
    }
};
