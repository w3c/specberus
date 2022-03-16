import { config } from '../../../../lib/profiles/TR/Registry/RY.js';
import registryBase from './registryBase.js';

const { buildCommonViewData, data } = registryBase;

const profile = 'RY';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isRY: true,
        underPP: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Registry/RY?type=good
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
                isRY: false,
            },
        },
    },
    usage: {
        noUsage: {
            ...good,
            config: {
                ...good.config,
                isRY: false,
            },
        },
    },
};
