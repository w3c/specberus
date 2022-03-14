const self = {
    name: 'style.body-toc-sidebar',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    try {
        const body = sr.jsDocument.querySelector('body');
        if (body && body.classList.contains('toc-sidebar'))
            sr.error(self, 'class-found');
    } catch (e) {
        sr.error(self, 'selector-fail');
    }
    done();
}
