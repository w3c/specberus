/* eslint-disable import/no-dynamic-require */
const { data } = require('./recommendation-base');

const profile = 'PR';
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
        needImple: true,
        isPR: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/PR?type=good
const good = { ...data, ...customData };
exports.good = good;
