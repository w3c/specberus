const {
    rules,
    candidateReviewEndRules,
    echidnaRules,
    securityPrivacyRules,
} = require('./recommendationBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        'draft-stability': [],
        'candidate-review-end': candidateReviewEndRules,
    },
    echidna: echidnaRules,
    structure: {
        ...rules.structure,
        'security-privacy': securityPrivacyRules,
    },
};
