import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'style.body-toc-sidebar',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    try {
        if (sr.$('body').hasClass('toc-sidebar')) sr.error(self, 'class-found');
    } catch (e) {
        sr.error(self, 'selector-fail');
    }
    done();
};
