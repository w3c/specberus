import recommendationBase from './recommendationBase.js';

const {
    rules: baseRules,
    securityPrivacyRules,
    draftStabilityRulesForDraft,
} = recommendationBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRulesForDraft,
    },
    structure: {
        ...baseRules.structure,
        'security-privacy': securityPrivacyRules,
    },
};
