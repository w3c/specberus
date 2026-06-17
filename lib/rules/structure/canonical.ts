import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'structure.canonical',
    section: 'metadata',
    rule: 'canonical',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const checkCanonical = function () {
        const $lnk = context.$('head > link[rel=canonical]').first();
        if (!$lnk.length || !$lnk.attr('href'))
            context.error(self, 'not-found');
    };

    // That canonical link is mandatory starting from Oct 1, 2017.
    // See https://lists.w3.org/Archives/Public/spec-prod/2017JulSep/0005.html
    context.transition({
        to: new Date('2017-09-30'),
        doMeanwhile: () => {},
        doAfter: checkCanonical,
    });
};
