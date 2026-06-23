import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'headers.translation',
    section: 'front-matter',
    rule: 'translation',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const translationLink = context
        .$('body div.head a')
        .toArray()
        .find(link => {
            return context
                .$(link)
                .text()
                .toLowerCase()
                .includes('translations');
        });

    if (!translationLink) {
        context.error(self, 'not-found');
        return;
    }

    const href = translationLink.attribs.href;
    context.info(self, 'found', { link: href });
    if (
        !context
            .norm(href)
            .toLowerCase()
            .startsWith('https://www.w3.org/translations/')
    ) {
        context.warning(self, 'not-recommended-link');
    }
};
