import { config } from '../../../../lib/profiles/TR/Note/STMT.js';
import noteBase from './noteBase.js';

const { buildCommonViewData, data } = noteBase;

const profile = 'STMT';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isSTMT: true,
        needTranslation: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/STMT?type=good
const good = { ...data, ...customData };

// Test hasException by failing a rule, accompanied by
// metadata that downgrades the failure from error to warning
const goodException = {
    ...good,
    dl: {
        ...good.dl,
        editor2: {
            show: true,
            id: '3440',
        },
        history: {
            ...data.dl.history,
            shortName: 'privacy-principles',
        },
        shortName: 'privacy-principles',
        seriesShortName: 'privacy-principles',
    },
};
const common = buildCommonViewData(good);

export default {
    good,
    goodException,
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
    translation: {
        notFound: {
            ...good,
            config: {
                ...good.config,
                needTranslation: false,
            },
        },
    },
};
