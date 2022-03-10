import recommendationBase from './recommendationBase';

const {
    candidateReviewEndRules,
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
    structure: {
        ...baseRules.structure,
        'security-privacy': securityPrivacyRules,
    },
};
