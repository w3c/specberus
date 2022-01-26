/* eslint-disable import/no-dynamic-require */
const { buildCommonViewData, data } = require('./noteBase');

const profile = 'STMT';
const { config } = require(`../../../../lib/profiles/TR/Note/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isSTMT: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/STMT?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);

module.exports = {
    good,
    ...common,
    stability: {
        ...common.stability,
        noStability: {
            ...good,
            config: {
                ...good.config,
                isSTMT: false,
            },
        },
    },
};
