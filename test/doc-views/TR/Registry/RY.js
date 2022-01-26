/* eslint-disable import/no-dynamic-require */
const { buildCommonViewData, data } = require('./registryBase');

const profile = 'RY';
const { config } = require(`../../../../lib/profiles/TR/Registry/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isRY: true,
        underPP: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Registry/RY?type=good
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
                isRY: false,
            },
        },
    },
    usage: {
        noUsage: {
            ...good,
            config: {
                ...good.config,
                isRY: false,
            },
        },
    },
};
