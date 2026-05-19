import { config } from '../../../../lib/profiles/TR/Recommendation/CR.js';
import recommendationBase from './recommendationBase.js';

const {
    buildCandidateReviewEnd,
    buildCommonViewData,
    buildSecurityPrivacy,
    data,
} = recommendationBase;

const profile = 'CR';

const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isCR: true,
        notEndorsed: true,
        hasLicensing: true,
        needImple: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/CR?type=good
const good = { ...data, ...customData };

export default {
    good,
    ...buildCommonViewData(good),
    'candidate-review-end': buildCandidateReviewEnd(good),
    'security-privacy': buildSecurityPrivacy(good),
};
