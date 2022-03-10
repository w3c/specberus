import recommendationBase from './recommendationBase';

const { rules: baseRules, draftStabilityRules } = recommendationBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRules,
    },
};
