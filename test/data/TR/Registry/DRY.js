import registryBase from './registryBase.js';

const { rules: baseRules, draftStabilityRules } = registryBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRules,
    },
};
