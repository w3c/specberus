import recommendationBase from './recommendationBase.js';

const {
    candidateReviewEndRules,
    echidnaRules,
    rules: baseRules,
    securityPrivacyRules,
} = recommendationBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': [],
        'candidate-review-end': candidateReviewEndRules,
    },
    echidna: echidnaRules,
    structure: {
        ...baseRules.structure,
        'security-privacy': securityPrivacyRules,
    },
};
