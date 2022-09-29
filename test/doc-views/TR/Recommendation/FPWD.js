import { config } from '../../../../lib/profiles/TR/Recommendation/FPWD.js';
import recommendationBase from './recommendationBase.js';

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
    // FPWD should have a unique shortname
    dl: {
        ...data.dl,
        history: {
            ...data.dl.history,
            shortName: 'hr-time-new',
        },
        shortName: 'hr-time-new',
        seriesShortName: 'hr-time-new',
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
