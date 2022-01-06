/* eslint-disable import/no-dynamic-require */
const { data } = require('./registry-base');

const profile = 'RY';
const { config } = require(`../../../../lib/profiles/TR/Registry/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isRY: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Registry/RY?type=good
const good = { ...data, ...customData };
exports.good = good;
