const {
    rules,
    securityPrivacyRules,
    newFeaturesRules,
} = require('./recommendationBase');

exports.rules = {
    ...rules,
    structure: {
        ...rules.structure,
        'security-privacy': securityPrivacyRules,
    },
    sotd: {
        ...rules.sotd,
        'ac-review': [
            {
                data: 'noACReview',
                errors: ['sotd.ac-review.not-found'],
            },
        ],
        'review-end': [
            {
                data: 'noReviewEndMatched',
                warnings: ['sotd.review-end.not-found'],
            },
            {
                data: 'noReviewEndFound',
                warnings: ['sotd.review-end.not-found'],
            },
        ],
        'new-features': newFeaturesRules,
    },
};
