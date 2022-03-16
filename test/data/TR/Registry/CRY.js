import registryBase from './registryBase.js';

const { rules: baseRules, candidateReviewEndRules } = registryBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'candidate-review-end': candidateReviewEndRules,
    },
};
