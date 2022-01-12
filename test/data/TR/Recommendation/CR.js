/* eslint-disable import/no-dynamic-require */
const { data } = require('./recommendation-base');

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
exports.good = good;
