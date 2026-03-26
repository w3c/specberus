import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'headers.translation',
    section: 'front-matter',
    rule: 'translation',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    const translationLink = sr
        .$('body div.head a')
        .toArray()
        .find(link => {
            return sr.$(link).text().toLowerCase().includes('translations');
        });

    if (!translationLink) {
        sr.error(self, 'not-found');
        return done();
    }

    const href = translationLink.attribs.href;
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
};
