/* eslint-disable import/no-dynamic-require */
const { data } = require('./recommendation-base');

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
exports.good = good;
