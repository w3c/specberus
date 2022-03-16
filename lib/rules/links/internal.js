const self = {
    name: 'links.internal',
    section: 'document-body',
    rule: 'brokenLink',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    sr.jsDocument.querySelectorAll("a[href^='#']").forEach(element => {
        const id = element.getAttribute('href').replace('#', '');
        const escId = id.replace(/([.()#:[\]+*])/g, '\\$1');
        if (id === '') return;
        if (
            !sr.jsDocument.querySelectorAll(`#${escId}, a[name='${id}']`).length
        ) {
            sr.error(self, 'anchor', { id });
        }
    });
    done();
}
