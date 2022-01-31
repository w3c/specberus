/* eslint-disable import/no-dynamic-require */
const {
    buildCommonViewData,
    buildDraftStability,
    data,
} = require('./registryBase');

const profile = 'DRY';
const { config } = require(`../../../../lib/profiles/TR/Registry/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        notEndorsed: true,
        isDRY: true,
        maybeUpdated: true,
        underPP: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Registry/DRY?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);

module.exports = {
    good,
    ...common,
    'draft-stability': buildDraftStability(good),
};
