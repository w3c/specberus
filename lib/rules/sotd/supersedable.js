// SotD
//  must start with
//      <p><em>This section describes the status of this document at the time of its publication.
//      A list of current W3C publications and the
//      latest revision of this technical report can be found in the
//      <a href="https://www.w3.org/TR/">W3C Standards and draft index</a>.</em></p>

import { filter } from '../../util.js';

const self = {
    name: 'sotd.supersedable',
    section: 'document-status',
    rule: 'boilerplateTRDoc',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        let em;
        Array.prototype.some.call(filter(sotd, 'p'), paragraph => {
            if (paragraph.querySelector('em')) {
                em = paragraph.querySelector('em');
                return true;
            }
        });
        if (!em)
            em =
                (sotd.querySelectorAll('p em') && sotd.querySelector('p em')) ||
                '';
        const txt = sr.norm(em.textContent);
        const wanted = `${'This section describes the status of this document at the time of its publication. A list of current W3C publications '}${
            sr.config.status === 'SUBM'
                ? ''
                : 'and the latest revision of this technical report '
        }can be found in the W3C standards and drafts index.`;

        const deprecatedWanted = wanted.replace(
            'W3C standards and drafts index',
            'W3C technical reports index'
        );

        if (txt !== wanted) {
            if (txt === deprecatedWanted) {
                sr.warning(self, 'deprecated');
            } else {
                sr.error(self, 'no-sotd-intro');
            }
        }

        const a = em && em.querySelectorAll("a[href='https://www.w3.org/TR/']");
        if (!a || !a.length) sr.error(self, 'no-sotd-tr');
    }
    done();
}
