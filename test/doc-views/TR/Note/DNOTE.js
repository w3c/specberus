import { config } from '../../../../lib/profiles/TR/Note/DNOTE.js';
import noteBase from './noteBase.js';

const { buildCommonViewData, buildDraftStability, data } = noteBase;

const profile = 'DNOTE';
const customData = {
    ...data,
    config: {
        ...config,
        ...data.config,
        profile,
        isDNOTE: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/DNOTE?type=good
const good = { ...data, ...customData };

const common = buildCommonViewData(good);

export default {
    good,
    ...common,
    stability: {
        ...common.stability,
        noStability: {
            ...good,
            config: {
                ...good.config,
                isDNOTE: false,
            },
        },
    },
    'draft-stability': buildDraftStability(good),
};
