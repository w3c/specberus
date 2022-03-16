import recommendationBase from './recommendationBase.js';

const { rules: baseRules, draftStabilityRules } = recommendationBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRules,
    },
};
