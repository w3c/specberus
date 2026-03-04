import w3cApi from 'node-w3capi';
import { resolveGithubUsernameToId } from '../../util.js';

/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'headers.editor-participation',
    section: 'front-matter',
    rule: 'editorSection',
};
export const name = self.name;

/**
 * @param {Specberus} sr
 * @param  done
 */
export async function check(sr, done) {
    const groups = await sr.getDelivererIDs();
    const editors = sr.extractHeaders()?.Editor;
    const editorsToCheck = [];
    const unresolvedUsernames = [];
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
                        else unresolvedUsernames.push(username);
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
    }

    const groupUsersPromises = [];
    groups.forEach(id => {
        groupUsersPromises.push(
            new Promise(resolve =>
                w3cApi
                    .group(id)
                    .users()
                    .fetch({ embed: true }, (err, data) => {
                        resolve(data.map(user => user.id));
                    })
            )
        );
    });

    const userIds = (await Promise.all(groupUsersPromises)).flat();

    editorsToCheck.forEach(id => {
        if (!userIds.includes(id)) {
            sr.error(self, 'not-participating', { id });
        }
    });

    done();
}
