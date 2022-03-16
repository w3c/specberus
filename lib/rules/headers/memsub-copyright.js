const self = {
    name: 'headers.memsub-copyright',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const copyright = sr.jsDocument.querySelector('body div.head p.copyright');
    if (copyright) {
        // ,   "https://www.w3.org/Consortium/Legal/copyright-documents":           "document use"
        const seen = Array.prototype.some.call(
            copyright.querySelectorAll('a[href]'),
            a =>
                a
                    .getAttribute('href')
                    .indexOf(
                        'https://www.w3.org/Consortium/Legal/copyright-documents'
                    ) === 0
        );
        if (!seen) sr.error(self, 'not-found');
    } else sr.error(self, 'not-found');
    done();
}
