// These 2 sentences exist in draft documents only, choose one of the 2.
const self = {
    name: 'sotd.draft-stability',
    section: 'document-status',
    rule: 'draftStability',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    const { crType } = sr.config;
    let STABILITY =
        'This is a draft document and may be updated, replaced or obsoleted by other documents at any time.';
    if (
        !sr.config.longStatus.match('Note$') &&
        sr.config.longStatus !== 'Candidate Recommendation'
    ) {
        STABILITY +=
            ' It is inappropriate to cite this document as other than work in progress.';
    }
    const STABILITY_2 =
        'This document is maintained and updated at any time. Some parts of this document are work in progress.';

    if (sotd) {
        const txt = sr.norm(sotd.textContent);

        if (
            !txt.includes(STABILITY) &&
            !(crType && crType === 'Draft' && txt.includes(STABILITY_2))
        ) {
            sr.error(self, 'not-found', {
                expected1: STABILITY,
                expected2: STABILITY_2,
            });
        }
    }
    done();
};
