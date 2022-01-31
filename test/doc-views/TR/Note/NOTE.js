/* eslint-disable import/no-dynamic-require */
const { buildCommonViewData, data } = require('./noteBase');

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

// Used in http://localhost:8001/doc-views/TR/Note/NOTE?type=good
const good = { ...data, ...customData };

const common = buildCommonViewData(good);

module.exports = {
    good,
    ...common,
};
