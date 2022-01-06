/* eslint-disable import/no-dynamic-require */
const { data } = require('./recommendation-base');

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
exports.good = good;
