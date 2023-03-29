import { config } from '../../../../lib/profiles/TR/Recommendation/WD.js';
import recommendationBase from './recommendationBase.js';

const { buildCommonViewData, buildDraftStability, buildSecurityPrivacy, data } =
    recommendationBase;

const profile = 'WD';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        notEndorsed: true,
        maybeUpdated: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/WD?type=good
const good = { ...data, ...customData };

const commonData = buildCommonViewData(good);

export default {
    good,
    ...commonData,
    'draft-stability': buildDraftStability(good),
    'security-privacy': buildSecurityPrivacy(good),
};
