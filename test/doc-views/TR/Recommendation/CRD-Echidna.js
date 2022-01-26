/* eslint-disable import/no-dynamic-require */
const data = require('./CRD').good;
const {
    buildCommonViewData,
    buildTodaysDate,
    buildDraftStability,
    buildSecurityPrivacy,
} = require('./recommendationBase');

const profile = 'CRD-Echidna';
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

// Used in http://localhost:8001/doc-views/TR/Recommendation/CRD-Echidna?type=good
const good = { ...data, ...customData };

const common = buildCommonViewData(good);

module.exports = {
    good,
    ...common,
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
                defaultDate: '04 November 2020',
            },
        },
    },
    'draft-stability': buildDraftStability(good),
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
    'security-privacy': buildSecurityPrivacy(good),
};
