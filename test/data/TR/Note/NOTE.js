/* eslint-disable import/no-dynamic-require */
const { data } = require('./note-base');

const profile = 'NOTE';
const { config } = require(`../../../../lib/profiles/TR/Note/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isNOTE: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/DNOTE?type=good
const good = { ...data, ...customData };
exports.good = good;
