/**
 * Check the presence of a valid ToC.
 */

import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'headers.h2-toc',
    // @TODO: fix the section... when it is fixed in the JSON.
    section: 'navigation',
    // @TODO: update this selector... when the rule is added to the JSON.
    rule: 'toc',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const EXPECTED_HEADING = /^table\s+of\s+contents$/i;
    const $tocNav = context.$('nav#toc > h2');
    const $tocDiv = context.$('div#toc > h2');
    let $toc;

    if ($tocDiv.length > 0) {
        if ($tocNav.length > 0) context.error(self, 'mixed');
        else {
            context.warning(self, 'not-html5');
            $toc = $tocDiv;
        }
    } else if ($tocNav.length > 0) $toc = $tocNav;
    else context.error(self, 'not-found');
    if ($toc && $toc.length > 0) {
        let matches = 0;
        $toc.each((_, el) => {
            if (EXPECTED_HEADING.test(context.norm(context.$(el).text())))
                matches += 1;
        });
        if (matches > 1) context.error(self, 'too-many');
        else if (matches === 0) context.error(self, 'not-found');
    }
};
