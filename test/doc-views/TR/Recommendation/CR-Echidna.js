/* eslint-disable import/no-dynamic-require */
const data = require('./CR').good;
const {
    buildCommonViewData,
    buildCandidateReviewEnd,
    buildTodaysDate,
    buildSecurityPrivacy,
} = require('./recommendationBase');

const profile = 'CR-Echidna';
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

// Used in http://localhost:8001/doc-views/TR/Recommendation/CR-Echidna?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);
const creCommon = buildCandidateReviewEnd(good);

module.exports = {
    good,
    ...common,
    'candidate-review-end': {
        noDateFound: {
            ...creCommon.noDateFound,
            config: {
                ...creCommon.noDateFound.config,
                isEchidna: false,
            },
        },
        multipleDateFound: {
            ...creCommon.multipleDateFound,
            config: {
                ...creCommon.multipleDateFound.config,
                isEchidna: false,
            },
        },
        invalidDate: {
            ...creCommon.invalidDate,
            config: {
                ...creCommon.invalidDate.config,
                isEchidna: false,
            },
        },
    },
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
