import { config } from '../../../../lib/profiles/TR/Recommendation/DISC.js';
import recommendationBase from './recommendationBase.js';

const { buildCommonViewData, data } = recommendationBase;

const profile = 'DISC';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isDISC: true,
        notEndorsed: false,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/DISC?type=good
const good = { ...data, ...customData };
const commonData = buildCommonViewData(good);

export default {
    good,
    ...commonData,
    stability: {
        ...commonData.stability,
        noCRReview: {
            ...good,
            config: {
                ...good.config,
                maybeUpdated: false,
            },
        },
    },
};
