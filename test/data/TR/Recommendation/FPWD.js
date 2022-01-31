const { rules, draftStabilityRules } = require('./recommendationBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'draft-stability': draftStabilityRules,
    },
};
