/* eslint-disable import/no-dynamic-require */
const data = require('./WD').good;
const {
    buildCommonViewData,
    buildDraftStability,
    buildSecurityPrivacy,
    buildTodaysDate,
} = require('./recommendationBase');

const profile = 'WD-Echidna';
const {
    config,
} = require(`../../../../lib/profiles/TR/Recommendation/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isEchidna: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/WD-Echidna?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);

module.exports = {
    good,
    ...common,
    'draft-stability': buildDraftStability(good),
    'security-privacy': buildSecurityPrivacy(good),
    dl: {
        ...common.dl,
        wrongThisDate: {
            ...good,
            config: {
                ...good.config,
                isEchidna: false,
            },
            header: {
                ...good.header,
                defaultDate: '04 October 2021',
            },
        },
    },
    pp: {
        ...common.pp,
        noPP2017: {
            ...common.pp.noPP2017,
            config: {
                ...common.pp.noPP2017.config,
                isEchidna: false,
            },
        },
    },
    'todays-date': buildTodaysDate(good),
};
