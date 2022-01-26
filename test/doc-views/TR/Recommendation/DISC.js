/* eslint-disable import/no-dynamic-require */
const { buildCommonViewData, data } = require('./recommendationBase');

const profile = 'DISC';
const {
    config,
} = require(`../../../../lib/profiles/TR/Recommendation/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isDISC: true,
        notEndorsed: false,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/DISC?type=good
const good = { ...data, ...customData };
const commonData = buildCommonViewData(good);

module.exports = {
    good,
    ...commonData,
    stability: {
        ...commonData.stability,
        noCRReview: {
            ...good,
            config: {
                ...good.config,
                maybeUpdated: false,
            },
        },
    },
};
