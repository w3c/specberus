const self = {
    name: 'headers.logo',
    section: 'front-matter',
    rule: 'logo',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const logo = sr.jsDocument.querySelector(
        "body div.head a[href] > img[src][alt='W3C']"
    );
    if (
        !logo ||
        !/^(https:)?\/\/www\.w3\.org\/StyleSheets\/TR\/2021\/logos\/W3C?$/.test(
            logo.src
        ) ||
        !/^(https:)?\/\/www\.w3\.org\/?$/.test(logo.parentElement.href)
    ) {
        sr.error(self, 'not-found');
    }
    done();
}
