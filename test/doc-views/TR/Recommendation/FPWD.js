import { config } from '../../../../lib/profiles/TR/Recommendation/FPWD';
import recommendationBase from './recommendationBase';

const { buildCommonViewData, buildDraftStability, data } = recommendationBase;

const profile = 'FPWD';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        notEndorsed: true,
        maybeUpdated: true,
        isFPWD: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/FPWD?type=good
const good = { ...data, ...customData };

export default {
    // good data that used to generate 100% right documents.
    good,
    ...buildCommonViewData(good),
    'draft-stability': buildDraftStability(good),
};
