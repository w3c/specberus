import type { RuleCheckFunction } from "../../types.js";

const self = {
    name: 'links.internal',
    section: 'document-body',
    rule: 'brokenLink',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    sr.$("a[href^='#']").each((_, el) => {
        const id = el.attribs.href.replace('#', '');
        const escId = id.replace(/([.()#:[\]+*])/g, '\\$1');
        if (id === '') return;
        if (!sr.$(`#${escId}, a[name='${id}']`).length) {
            sr.error(self, 'anchor', { id });
        }
    });
    done();
};
