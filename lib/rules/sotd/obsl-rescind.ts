// SotD
// <p>W3C has chosen to (rescind|obsolete|supersede) the Sample Specification Recommendation for the
// following reasons: [...list of reasons...]. For additional information about
// replacement or alternative technologies, please refer to the <a
// href="https://www.w3.org/2016/11/obsoleting-rescinding/">explanation of
// Obsoleting and Rescinding W3C Specifications</a>.</p>

import type { Cheerio } from 'cheerio';
import type { Specberus } from '../../validator.js';
import type { Element } from 'domhandler';
import type { RuleCheckFunction } from '../../types.js';

function findRscndRationale($candidates: Cheerio<Element>, sr: Specberus) {
    const v = sr.config!.rescinds === true ? 'rescind' : '';

    for (const p of $candidates.toArray()) {
        const $p = sr.$(p);
        const text = sr.norm($p.text());
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

const self = {
    name: 'sotd.obsl-rescind',
    section: 'document-status',
    rule: 'rescindsRationale',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    const $sotd = sr.getSotDSection();
    if ($sotd) {
        const $rationale =
            findRscndRationale($sotd.filter('p'), sr) ||
            findRscndRationale($sotd.find('p'), sr);
        if (!$rationale?.length) {
            sr.error(self, 'no-rationale');
        } else {
            const $a = $rationale.find('a:last-child').first();
            const href = $a.attr('href');
            const text = sr.norm($a.text());
            if (
                href !== 'https://www.w3.org/2016/11/obsoleting-rescinding/' ||
                text !==
                    'explanation of Obsoleting, Rescinding or Superseding W3C Specifications'
            ) {
                sr.error(self, 'no-explanation-link');
            }
        }
    }
    done();
};
