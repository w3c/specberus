/* eslint-disable import/no-dynamic-require */
const data = require('./DNOTE').good;
const {
    buildCommonViewData,
    buildDraftStability,
    buildTodaysDate,
} = require('./noteBase');

const profile = 'DNOTE-Echidna';
const { config } = require(`../../../../lib/profiles/TR/Note/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isEchidna: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/DNOTE-Echidna?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);

module.exports = {
    good,
    ...common,
    dl: {
        ...common.dl,
        wrongThisDate: {
            ...common.dl.wrongThisDate,
            config: {
                ...common.dl.wrongThisDate.config,
                isEchidna: false,
            },
        },
    },
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
    'todays-date': buildTodaysDate(good),
};
