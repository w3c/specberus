/* eslint-disable import/no-dynamic-require */
const {
    buildCommonViewData,
    buildCandidateReviewEnd,
    buildSecurityPrivacy,
    data,
} = require('./recommendationBase');

const profile = 'CR';
const {
    config,
} = require(`../../../../lib/profiles/TR/Recommendation/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isCR: true,
        notEndorsed: true,
        hasLicensing: true,
        needImple: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/CR?type=good
const good = { ...data, ...customData };

module.exports = {
    good,
    ...buildCommonViewData(good),
    'candidate-review-end': buildCandidateReviewEnd(good),
    'security-privacy': buildSecurityPrivacy(good),
};
