import type { RuleCheckFunction } from "../../types.js";

const self = {
    name: 'headers.memsub-copyright',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    const $copyright = sr.$('body div.head p.copyright').first();
    if ($copyright.length) {
        // ,   "https://www.w3.org/copyright/document-license/":           "document use"
        const seen = $copyright
            .find('a[href]')
            .toArray()
            .some(
                a =>
                    a.attribs.href.indexOf(
                        'https://www.w3.org/copyright/document-license/'
                    ) === 0
            );
        if (!seen) sr.error(self, 'not-found');
    } else sr.error(self, 'not-found');
    done();
}
