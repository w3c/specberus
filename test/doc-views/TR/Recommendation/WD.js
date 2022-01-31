/* eslint-disable import/no-dynamic-require */
const {
    buildCommonViewData,
    buildDraftStability,
    buildSecurityPrivacy,
    data,
} = require('./recommendationBase');

const profile = 'WD';
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
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/WD?type=good
const good = { ...data, ...customData };

module.exports = {
    good,
    ...buildCommonViewData(good),
    'draft-stability': buildDraftStability(good),
    'security-privacy': buildSecurityPrivacy(good),
};
