// SotD
// <p>W3C has chosen to (rescind|obsolete|supersede) the Sample Specification Recommendation for the
// following reasons: [...list of reasons...]. For additional information about
// replacement or alternative technologies, please refer to the <a
// href="https://www.w3.org/2016/11/obsoleting-rescinding/">explanation of
// Obsoleting and Rescinding W3C Specifications</a>.</p>
import { filter } from '../../util.js';

/**
 * @param candidates
 * @param sr
 */
function findRscndRationale(candidates, sr) {
    let rationale = null;
    let v;
    if (sr.config.rescinds === true) v = 'rescind';

    Array.prototype.some.call(candidates, p => {
        const text = sr.norm(p.textContent);
        const wanted1 = new RegExp(
            `W3C has chosen to ${v} the .*? Recommendation for the following reasons:`,
            'i'
        );
        const wanted2 = new RegExp(
            'For additional information about replacement or alternative technologies,' +
                ' please refer to the explanation of Obsoleting, Rescinding or Superseding W3C Specifications.',
            'i'
        );
        if (wanted1.test(text) && wanted2.test(text)) {
            rationale = p;
            return true;
        }
    });
    return rationale;
}

const self = {
    name: 'sotd.obsl-rescind',
    section: 'document-status',
    rule: 'rescindsRationale',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        const rationale =
            findRscndRationale(filter(sotd, 'p'), sr) ||
            findRscndRationale(sotd.querySelectorAll('p'), sr);
        if (!rationale) {
            sr.error(self, 'no-rationale');
        } else {
            const a = rationale.querySelector('a:last-child');
            const href = a && a.getAttribute('href');
            const text = sr.norm(a.textContent);
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
}
