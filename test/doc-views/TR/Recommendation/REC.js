/* eslint-disable import/no-dynamic-require */
const { data } = require('./recommendation-base');

const profile = 'REC';
const {
    config,
} = require(`../../../../lib/profiles/TR/Recommendation/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isREC: true,
        notEndorsed: false,
        hasLicensing: true,
        needImple: true,
        needErrata: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/REC?type=good
const good = { ...data, ...customData };
exports.good = good;
