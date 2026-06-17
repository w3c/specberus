import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'links.internal',
    section: 'document-body',
    rule: 'brokenLink',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    context.$("a[href^='#']").each((_, el) => {
        const id = el.attribs.href.replace('#', '');
        const escId = id.replace(/([.()#:[\]+*])/g, '\\$1');
        if (id === '') return;
        if (!context.$(`#${escId}, a[name='${id}']`).length) {
            context.error(self, 'anchor', { id });
        }
    });
};
