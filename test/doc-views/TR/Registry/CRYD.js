import { config } from '../../../../lib/profiles/TR/Registry/CRYD.js';
import registryBase from './registryBase.js';

const { buildCommonViewData, buildDraftStability, data } = registryBase;

const profile = 'CRYD';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        notEndorsed: true,
        isCRYD: true,
        maybeUpdated: true,
        underPP: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Registry/CRYD?type=good
const good = { ...data, ...customData };

// Used in http://localhost:8001/doc-views/TR/Recommendation/CRYD?type=good2
export const good2 = {
    config: {
        ...good.config,
    },
    sotd: {
        ...good.sotd,
        draftText:
            'This document is maintained and updated at any time. Some parts of this document are work in progress.',
    },
};

const common = buildCommonViewData(good);

export default {
    good,
    ...common,
    'draft-stability': buildDraftStability(good),
};
