import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'structure.section-ids',
    section: 'document-body',
    rule: 'headingWithoutID',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const $ignoreH3 = context.$('.head > h3').first();

    context.$('h2, h3, h4, h5, h6').each((_, el) => {
        const $el = context.$(el);
        // has an id
        if ($el.attr('id') || el === $ignoreH3[0]) return;

        // has no element previous sibling, has parent div or section, and that has an id
        //  without prevAll that sucks... get children of parent and find self
        const $parent = context.$(el).parent();
        const $sibs = $parent.children();
        if (
            $sibs[0] === el &&
            ($parent.is('section') || $parent.is('div')) &&
            $parent.attr('id')
        )
            return;
        // has a descendant that has an id
        if ($el.find('*[id]').length) return;

        // has an a[name] descendant
        if ($el.find('a[name]').length) return;

        // has a[name] as previous element sibling
        for (let i = 1, n = $sibs.length; i < n; i += 1) {
            if ($sibs[i] === el && $sibs.eq(i - 1).is('a[name]')) return;
        }

        // this is the status h2
        const $stateEl = context.getDocumentStateElement();
        if ($stateEl && el === $stateEl[0]) return;

        context.error(self, 'no-id', { text: el.name });
    });
};
