/* eslint-disable import/no-dynamic-require */
const data = require('./CR').good;

const profile = 'CR-Echidna';
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

// Used in http://localhost:8001/doc-views/TR/Recommendation/CR-Echidna?type=good
const good = { ...data, ...customData };
exports.good = good;
