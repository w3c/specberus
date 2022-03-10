import registryBase from './registryBase';

const { rules: baseRules, draftStabilityRulesForDraft } = registryBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRulesForDraft,
    },
};
