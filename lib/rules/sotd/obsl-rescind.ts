// SotD
// <p>W3C has chosen to (rescind|obsolete|supersede) the Sample Specification Recommendation for the
// following reasons: [...list of reasons...]. For additional information about
// replacement or alternative technologies, please refer to the <a
// href="https://www.w3.org/2016/11/obsoleting-rescinding/">explanation of
// Obsoleting and Rescinding W3C Specifications</a>.</p>

import type { Cheerio } from 'cheerio';
import type { RuleContext } from '../../validator.js';
import type { Element } from 'domhandler';
import type { RuleCheckFunction, RuleMeta } from '../../types.js';

function findRscndRationale(
    $candidates: Cheerio<Element>,
    context: RuleContext
) {
    const v = context.config!.rescinds === true ? 'rescind' : '';

    for (const p of $candidates.toArray()) {
        const $p = context.$(p);
        const text = context.norm($p.text());
        const wanted1 = new RegExp(
            `W3C has chosen to ${v} the .*? Recommendation for the following reasons:`,
            'i'
        );
        const wanted2 = new RegExp(
            'For additional information about replacement or alternative technologies,' +
                ' please refer to the explanation of Obsoleting, Rescinding or Superseding W3C Specifications.',
            'i'
        );
        if (wanted1.test(text) && wanted2.test(text)) return $p;
    }
}

const self: RuleMeta = {
    name: 'sotd.obsl-rescind',
    section: 'document-status',
    rule: 'rescindsRationale',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const $sotd = context.getSotDSection();
    if ($sotd) {
        const $rationale =
            findRscndRationale($sotd.filter('p'), context) ||
            findRscndRationale($sotd.find('p'), context);
        if (!$rationale?.length) {
            context.error(self, 'no-rationale');
        } else {
            const $a = $rationale.find('a:last-child').first();
            const href = $a.attr('href');
            const text = context.norm($a.text());
            if (
                href !== 'https://www.w3.org/2016/11/obsoleting-rescinding/' ||
                text !==
                    'explanation of Obsoleting, Rescinding or Superseding W3C Specifications'
            ) {
                context.error(self, 'no-explanation-link');
            }
        }
    }
};
