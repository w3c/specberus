const {
    rules,
    echidnaRules,
    draftStabilityRulesForDraft,
    securityPrivacyRules,
} = require('./recommendationBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'draft-stability': draftStabilityRulesForDraft,
    },
    echidna: echidnaRules,
    structure: {
        ...rules.structure,
        'security-privacy': securityPrivacyRules,
    },
};
