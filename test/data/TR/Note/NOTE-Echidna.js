/* eslint-disable import/no-dynamic-require */
const data = require('./NOTE').good;

const profile = 'NOTE-Echidna';
const { config } = require(`../../../../lib/profiles/TR/Note/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isEchidna: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/NOTE-Echidna?type=good
const good = { ...data, ...customData };
exports.good = good;
