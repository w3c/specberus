/* eslint-disable import/no-dynamic-require */
const {
    buildCommonViewData,
    buildSecurityPrivacy,
    buildNewFeatures,
    data,
} = require('./recommendationBase');

const profile = 'PR';
const {
    config,
} = require(`../../../../lib/profiles/TR/Recommendation/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        notEndorsed: true,
        maybeUpdated: true,
        needImple: true,
        isPR: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/PR?type=good
const good = { ...data, ...customData };

module.exports = {
    good,
    ...buildCommonViewData(good),
    'security-privacy': buildSecurityPrivacy(good),
    'ac-review': {
        noACReview: {
            ...good,
            sotd: {
                ...good.sotd,
                acReviewLink: 'https://www.w3.org/fake_url',
            },
        },
    },
    'review-end': {
        noReviewEndMatched: {
            ...good,
            config: {
                ...good.config,
                isPR: false,
            },
            sotd: {
                ...good.sotd,
                processHTML:
                    '<abbr title="World Wide Web Consortium">W3C</abbr> Process Document',
            },
        },
        noReviewEndFound: {
            ...good,
        },
    },
    'new-features': buildNewFeatures(good),
};
