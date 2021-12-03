// These 2 sentences exist in draft documents only, choose one of the 2.
const self = {
    name: 'sotd.draft-stability',
    section: 'document-status',
    rule: 'draftStability',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    const { crType, cryType } = sr.config;
    const STABILITY =
        'This is a draft document and may be updated, replaced or obsoleted by other documents at any time. It is inappropriate to cite this document as other than work in progress.';

    const STABILITY_2 =
        'This document is maintained and updated at any time. Some parts of this document are work in progress.';

    if (sotd) {
        const txt = sr.norm(sotd.textContent);

        // CRD and CRYD allows both sentence.
        if (
            ((crType && crType === 'Draft') ||
                (cryType && cryType === 'Draft')) &&
            !txt.includes(STABILITY) &&
            !txt.includes(STABILITY_2)
        )
            sr.error(self, 'not-found-either', {
                expected1: STABILITY,
                expected2: STABILITY_2,
            });
        // while other profiles allows only 'STABILITY' sentence
        else if (!txt.includes(STABILITY))
            sr.error(self, 'not-found', {
                expected: STABILITY,
            });
    }
    done();
};
