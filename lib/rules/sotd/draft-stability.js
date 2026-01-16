// These 2 sentences exist in draft documents only, choose one of the 2.

/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'sotd.draft-stability',
    section: 'document-status',
    rule: 'draftStability',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $sotd = sr.getSotDSection();
    const { crType, cryType } = sr.config;
    const STABILITY_REX =
        /This is a draft document and may be updated, replaced,? or obsoleted by other documents at any time\. It is inappropriate to cite this document as other than a work in progress\./;

    const STABILITY_2 =
        'This document is maintained and updated at any time. Some parts of this document are work in progress.';

    if ($sotd) {
        const txt = sr.norm($sotd.text());
        // CRD and CRYD allows both sentence.
        if (
            (crType && crType === 'Draft') ||
            (cryType && cryType === 'Draft')
        ) {
            if (!txt.match(STABILITY_REX) && !txt.includes(STABILITY_2))
                sr.error(self, 'not-found-either', {
                    expected1: STABILITY_REX,
                    expected2: STABILITY_2,
                });
        }

        // while other profiles allows only 'STABILITY' sentence
        else if (!txt.match(STABILITY_REX))
            sr.error(self, 'not-found', {
                expected: STABILITY_REX,
            });
    }
    done();
}
