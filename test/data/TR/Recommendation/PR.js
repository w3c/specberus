import recommendationBase from './recommendationBase';

const {
    rules: baseRules,
    securityPrivacyRules,
    newFeaturesRules,
} = recommendationBase;

export const rules = {
    ...baseRules,
    structure: {
        ...baseRules.structure,
        'security-privacy': securityPrivacyRules,
    },
    sotd: {
        ...baseRules.sotd,
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
