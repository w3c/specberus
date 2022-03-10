import { config } from '../../../../lib/profiles/TR/Note/STMT';
import noteBase from './noteBase';

const { buildCommonViewData, data } = noteBase;

const profile = 'STMT';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isSTMT: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/STMT?type=good
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
                isSTMT: false,
            },
        },
    },
};
