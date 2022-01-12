/* eslint-disable import/no-dynamic-require */
const { data } = require('./registry-base');

const profile = 'CRY';
const { config } = require(`../../../../lib/profiles/TR/Registry/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        notEndorsed: true,
        isCRY: true,
        maybeUpdated: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Registry/CRY?type=good
const good = { ...data, ...customData };
exports.good = good;
