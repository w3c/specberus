import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'headers.logo',
    section: 'front-matter',
    rule: 'logo',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    const $logo = sr.$("body div.head a[href] > img[src][alt='W3C']").first();
    if (
        !$logo.length ||
        !/^(https:)?\/\/www\.w3\.org\/StyleSheets\/TR\/2021\/logos\/W3C?$/.test(
            $logo.attr('src') || ''
        ) ||
        !/^(https:)?\/\/www\.w3\.org\/?$/.test(
            $logo.parent().attr('href') || ''
        )
    ) {
        sr.error(self, 'not-found');
    }
    done();
};
