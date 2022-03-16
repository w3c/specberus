import recommendationBase from './recommendationBase.js';

const {
    rules: baseRules,
    draftStabilityRules,
    securityPrivacyRules,
} = recommendationBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRules,
    },
    structure: {
        ...baseRules.structure,
        'security-privacy': securityPrivacyRules,
    },
};
