/* eslint-disable import/no-dynamic-require */
const {
    buildCommonViewData,
    buildDraftStability,
    data,
} = require('./recommendationBase');

const profile = 'FPWD';
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
        isFPWD: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/FPWD?type=good
const good = { ...data, ...customData };

module.exports = {
    // good data that used to generate 100% right documents.
    good,
    ...buildCommonViewData(good),
    'draft-stability': buildDraftStability(good),
};
