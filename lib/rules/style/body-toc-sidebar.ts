import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'style.body-toc-sidebar',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    try {
        if (context.$('body').hasClass('toc-sidebar'))
            context.error(self, 'class-found');
    } catch (e) {
        context.error(self, 'selector-fail');
    }
};
