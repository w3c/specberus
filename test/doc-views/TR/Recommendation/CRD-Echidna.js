import { config } from '../../../../lib/profiles/TR/Recommendation/CRD-Echidna.js';
import CRD from './CRD.js';
import recommendationBase from './recommendationBase.js';

const { good: data } = CRD;
const {
    buildCommonViewData,
    buildDraftStability,
    buildSecurityPrivacy,
    buildTodaysDate,
} = recommendationBase;

const profile = 'CRD-Echidna';
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

export default {
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
                defaultDate: '04 October 2023',
            },
        },
    },
    'draft-stability': buildDraftStability(good),
    'todays-date': buildTodaysDate(good),
    'security-privacy': buildSecurityPrivacy(good),
};
