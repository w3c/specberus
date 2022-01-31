const { rules, draftStabilityRulesForDraft } = require('./registryBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'draft-stability': draftStabilityRulesForDraft,
    },
};
