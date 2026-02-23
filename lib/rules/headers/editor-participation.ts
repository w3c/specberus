// @ts-ignore (No typings)
import w3cApi from 'node-w3capi';
import { resolveGithubUsernameToId } from '../../util.js';
import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'headers.editor-participation',
    section: 'front-matter',
    rule: 'editorSection',
};
export const name = self.name;

export const check: RuleCheckFunction = async (sr, done) => {
    const groups = await sr.getDelivererIDs();
    const editors = sr.extractHeaders()?.Editor;
    const editorsToCheck = [];
    if (editors) {
        // only check editors elements that don't have a span with class "former"
        for (const dd of editors.$dd.toArray()) {
            const $former = sr.$(dd).find('span.former').first();
            if (!$former.length || !sr.norm($former.text())) {
                if (dd.attribs['data-editor-id'])
                    editorsToCheck.push(
                        parseInt(dd.attribs['data-editor-id'], 10)
                    );
                else if (dd.attribs['data-editor-github']) {
                    const username = dd.attribs['data-editor-github'];
                    try {
                        const id = await resolveGithubUsernameToId(username);
                        if (id) editorsToCheck.push(id);
                    } catch (error) {
                        // Swallow API failure error (will be reported in headers.dl)
                    }
                }
            }
        }
    }

    const groupUsersPromises = groups.map(async id => {
        const data: { id: number }[] = await w3cApi
            .group(id)
            .users()
            .fetch({ embed: true })
            .catch(() => []);
        return data.map(({ id }) => id);
    });

    const userIds = (await Promise.all(groupUsersPromises)).flat();

    editorsToCheck.forEach(id => {
        if (!userIds.includes(id)) {
            sr.error(self, 'not-participating', { id });
        }
    });

    done();
};
