/* eslint-disable import/no-dynamic-require */
const data = require('./NOTE').good;
const { buildCommonViewData, buildTodaysDate } = require('./noteBase');

const profile = 'NOTE-Echidna';
const { config } = require(`../../../../lib/profiles/TR/Note/${profile}`);
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

module.exports = {
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
