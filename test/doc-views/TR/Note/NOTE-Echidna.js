import { config } from '../../../../lib/profiles/TR/Note/NOTE-Echidna.js';
import NOTE from './NOTE.js';
import noteBase from './noteBase.js';

const { good: data } = NOTE;
const { buildCommonViewData, buildTodaysDate } = noteBase;

const profile = 'NOTE-Echidna';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isEchidna: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/NOTE-Echidna?type=good
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
    'todays-date': buildTodaysDate(good),
};
