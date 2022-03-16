import { config } from '../../../../lib/profiles/TR/Note/DNOTE-Echidna.js';
import DNOTE from './DNOTE.js';
import noteBase from './noteBase.js';

const { good: data } = DNOTE;
const { buildCommonViewData, buildDraftStability, buildTodaysDate } = noteBase;

const profile = 'DNOTE-Echidna';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isEchidna: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/DNOTE-Echidna?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);

export default {
    good,
    ...common,
    dl: {
        ...common.dl,
        wrongThisDate: {
            ...common.dl.wrongThisDate,
            config: {
                ...common.dl.wrongThisDate.config,
                isEchidna: false,
            },
        },
    },
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
    'todays-date': buildTodaysDate(good),
};
