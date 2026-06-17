import type { RuleCheckFunction } from '../../types.js';

export const name = 'structure.h2';
const abstract = {
    name,
    section: 'front-matter',
    // @TODO: is there a better rule for this one?
    rule: 'divClassHead',
};
const sotd = {
    name,
    section: 'document-status',
    rule: 'sotd',
};
const toc = {
    name,
    section: 'navigation',
    rule: 'toc',
};

export const check: RuleCheckFunction = context => {
    const h2s: string[] = [];
    context.$('h2').each((_, h2) => {
        const $h2 = context.$(h2);
        if ($h2.parents('.head').length === 0)
            h2s.push(context.norm($h2.text()));
    });
    if (h2s[0] !== 'Abstract')
        context.error(abstract, 'abstract', { was: h2s[0] });
    // cspell:disable-next-line
    if (!/^Status [Oo]f [Tt]his [Dd]ocument$/.test(h2s[1]))
        context.error(sotd, 'sotd', { was: h2s[1] });
    // cspell:disable-next-line
    if (!/^Table [Oo]f [Cc]ontents$/.test(h2s[2]))
        context.error(toc, 'toc', { was: h2s[2] });
};
