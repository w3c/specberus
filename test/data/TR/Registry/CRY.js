const { rules, candidateReviewEndRules } = require('./registryBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'candidate-review-end': candidateReviewEndRules,
    },
};
