const {
    rules,
    candidateReviewEndRules,
    securityPrivacyRules,
} = require('./recommendationBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'draft-stability': [],
        'candidate-review-end': candidateReviewEndRules,
    },
    structure: {
        ...rules.structure,
        'security-privacy': securityPrivacyRules,
    },
};
