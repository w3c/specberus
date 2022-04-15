import recommendationBase from './recommendationBase.js';

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
    headers: {
        ...baseRules.headers,
        dl: [
            ...baseRules.headers.dl,
            {
                data: 'shortnameLowercase',
            },
        ],
    },
};
