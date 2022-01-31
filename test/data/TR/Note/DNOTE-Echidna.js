const { rules, draftStabilityRules, echidnaRules } = require('./noteBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'draft-stability': draftStabilityRules,
    },
    echidna: echidnaRules,
};
