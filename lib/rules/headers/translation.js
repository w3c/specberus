const self = {
    name: 'headers.translation',
    section: 'front-matter',
    rule: 'translation',
};

export const { name } = self;

export function check(sr, done) {
    const translationLink = Array.from(
        sr.jsDocument.querySelectorAll('body div.head a')
    ).find(link => {
        return link.textContent.toLowerCase().includes('translations');
    });

    if (!translationLink) {
        sr.error(self, 'not-found');
        return done();
    }

    const href = translationLink.href;
    sr.info(self, 'found', { link: href });
    if (
        !sr
            .norm(href)
            .toLowerCase()
            .startsWith('https://www.w3.org/translations/')
    ) {
        sr.warning(self, 'not-recommended-link');
    }

    done();
}
