import type { RuleCheckFunction } from '../../types.js';

export const name = 'style.sheet';
const section = 'metadata';
const missing = {
    name,
    section,
    rule: 'goodStylesheet',
};
const notLast = {
    name,
    section,
    rule: 'lastStylesheet',
};

export const check: RuleCheckFunction = (sr, done) => {
    const { styleSheet } = sr.config!;
    if (!styleSheet) return done();
    const url = `https://www.w3.org/StyleSheets/TR/2021/${styleSheet}`;
    const dark = 'https://www.w3.org/StyleSheets/TR/2021/dark';
    const stylesheetLinks = [
        `head > link[rel=stylesheet][href='${url}']`,
        `head > link[rel=stylesheet][href='${url}.css']`,
    ];
    const $lnk = sr.$(stylesheetLinks.join(', ')).first();
    if (!$lnk.length) sr.error(missing, 'not-found', { url });
    else {
        const $siblings = $lnk.nextAll('link[rel=stylesheet], style');
        if (
            $siblings.length > 1 ||
            ($siblings.length === 1 &&
                $siblings.eq(0).attr('href') !== dark &&
                $siblings.eq(0).attr('href') !== `${dark}.css`)
        ) {
            sr.error(notLast, 'last');
        }
    }
    done();
};
