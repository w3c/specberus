import recommendationBase from './recommendationBase';

const {
    rules: baseRules,
    echidnaRules,
    draftStabilityRulesForDraft,
    securityPrivacyRules,
} = recommendationBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRulesForDraft,
    },
    echidna: echidnaRules,
    structure: {
        ...baseRules.structure,
        'security-privacy': securityPrivacyRules,
    },
};
