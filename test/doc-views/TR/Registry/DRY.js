import { config } from '../../../../lib/profiles/TR/Registry/DRY.js';
import registryBase from './registryBase.js';

const { buildCommonViewData, buildDraftStability, data } = registryBase;

const profile = 'DRY';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        notEndorsed: true,
        isDRY: true,
        maybeUpdated: true,
        underPP: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Registry/DRY?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);

export default {
    good,
    ...common,
    'draft-stability': buildDraftStability(good),
};
