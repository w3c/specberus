/**
 * Check if there's a <em>back-top-top</em> hyperlink.
 */

const self = {
    name: 'style.back-to-top',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const candidates = sr.jsDocument.querySelectorAll(
        "body p#back-to-top[role='navigation'] a[href='#title']"
    );

    if (candidates.length !== 1) {
        sr.warning(self, 'not-found');
    }

    done();
}
