import w3cApi from 'node-w3capi';

const self = {
    name: 'headers.editor-participation',
    section: 'front-matter',
    rule: 'editorSection',
};
export const name = self.name;

export async function check(sr, done) {
    const groups = await sr.getDelivererIDs();
    const editors = sr.extractHeaders()?.Editor;
    const editorsToCheck = [];
    if (editors) {
        // only check editors elements that don't have a span with class "former"
        editors.dd.forEach(dd => {
            const former = dd.querySelector('span.former');
            if (!former || !sr.norm(former.textContent)) {
                editorsToCheck.push(parseInt(dd.dataset.editorId, 10));
            }
        });
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
