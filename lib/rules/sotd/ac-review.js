const self = {
    name: 'sotd.ac-review',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        let found = false;
        sotd.querySelectorAll("a[href*='www.w3.org/2002/09/wbs/']").forEach(
            element => {
                const href = element.getAttribute('href');
                found = true;
                // XXX use an <a href> to display the link
                sr.info(self, 'found', { link: href });
            }
        );
        if (!found) sr.error(self, 'not-found');
    }
    done();
}
