import { config } from '../../../../lib/profiles/TR/Note/NOTE.js';
import noteBase from './noteBase.js';

const { buildCommonViewData, data } = noteBase;

const profile = 'NOTE';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isNOTE: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/NOTE?type=good
const good = { ...data, ...customData };

const common = buildCommonViewData(good);

export default {
    good,
    ...common,
};
