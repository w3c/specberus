/* eslint-disable import/no-dynamic-require */
const data = require('./CRD').good;

const profile = 'CRD-Echidna';
const {
    config,
} = require(`../../../../lib/profiles/TR/Recommendation/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isEchidna: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/CRD-Echidna?type=good
const good = { ...data, ...customData };
exports.good = good;
