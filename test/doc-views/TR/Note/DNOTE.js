/* eslint-disable import/no-dynamic-require */
const {
    buildCommonViewData,
    buildDraftStability,
    data,
} = require('./noteBase');

const profile = 'DNOTE';
const { config } = require(`../../../../lib/profiles/TR/Note/${profile}`);
const customData = {
    ...data,
    config: {
        ...config,
        ...data.config,
        profile,
        isDNOTE: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/DNOTE?type=good
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
                isDNOTE: false,
            },
        },
    },
    'draft-stability': buildDraftStability(good),
};
