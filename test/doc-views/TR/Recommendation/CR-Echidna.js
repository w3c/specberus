import { config } from '../../../../lib/profiles/TR/Recommendation/CR-Echidna.js';
import CR from './CR.js';
import recommendationBase from './recommendationBase.js';

const {
    buildCandidateReviewEnd,
    buildCommonViewData,
    buildSecurityPrivacy,
    buildTodaysDate,
} = recommendationBase;

const { good: data } = CR;

const profile = 'CR-Echidna';
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

export default {
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
    'todays-date': buildTodaysDate(good),
    'security-privacy': buildSecurityPrivacy(good),
};
