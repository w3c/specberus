const {
    rules,
    securityPrivacyRules,
    draftStabilityRulesForDraft,
} = require('./recommendationBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'draft-stability': draftStabilityRulesForDraft,
    },
    structure: {
        ...rules.structure,
        'security-privacy': securityPrivacyRules,
    },
};
