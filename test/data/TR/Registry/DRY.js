const { rules, draftStabilityRules } = require('./registryBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'draft-stability': draftStabilityRules,
    },
};
