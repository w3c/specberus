import { config } from '../../../../lib/profiles/TR/Recommendation/CRD.js';
import recommendationBase from './recommendationBase.js';

const { buildCommonViewData, buildSecurityPrivacy, buildDraftStability, data } =
    recommendationBase;

const profile = 'CRD';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isCRD: true,
        notEndorsed: true,
        maybeUpdated: true,
        needImple: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/CRD?type=good
const good = { ...data, ...customData };

// Used in http://localhost:8001/doc-views/TR/Recommendation/CRD?type=good2
const good2 = {
    config: {
        ...good.config,
    },
    sotd: {
        ...good.sotd,
        draftText:
            'This document is maintained and updated at any time. Some parts of this document are work in progress.',
    },
};

export default {
    good,
    good2,
    ...buildCommonViewData(good),
    'draft-stability': buildDraftStability(good),
    'security-privacy': buildSecurityPrivacy(good),
};
