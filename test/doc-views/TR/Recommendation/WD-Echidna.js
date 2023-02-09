import { config } from '../../../../lib/profiles/TR/Recommendation/WD-Echidna.js';
import recommendationBase from './recommendationBase.js';
import WD from './WD.js';

const { good: data } = WD;
const {
    buildCommonViewData,
    buildDraftStability,
    buildSecurityPrivacy,
    buildTodaysDate,
} = recommendationBase;

const profile = 'WD-Echidna';
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

export default {
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
                defaultDate: '04 October 2023',
            },
        },
    },
    'todays-date': buildTodaysDate(good),
};
