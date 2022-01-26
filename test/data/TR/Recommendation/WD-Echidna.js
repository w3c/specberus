const {
    rules,
    draftStabilityRules,
    securityPrivacyRules,
    echidnaRules,
} = require('./recommendationBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'draft-stability': draftStabilityRules,
    },
    structure: {
        ...rules.structure,
        'security-privacy': securityPrivacyRules,
    },
    echidna: echidnaRules,
};
