const { rules, draftStabilityRules } = require('./noteBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'draft-stability': draftStabilityRules,
    },
};
