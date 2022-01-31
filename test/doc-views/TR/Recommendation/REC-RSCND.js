/* eslint-disable import/no-dynamic-require */
const data = require('./REC').good;
const {
    buildCommonViewData,
    buildRecStability,
} = require('./recommendationBase');

const profile = 'REC-RSCND';
const {
    config,
} = require(`../../../../lib/profiles/TR/Recommendation/${profile}`);
const customData = {
    config: {
        ...data.config,
        ...config,
        profile,
        isRescinded: true,
        needImple: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/REC-RSCND?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);

module.exports = {
    good,
    ...common,
    stability: buildRecStability(good),
    'obsl-rescind': {
        noRationale: {
            ...good,
            sotd: {
                ...good.sotd,
                rescindText1: 'chosen to fake rescind',
            },
        },
        noExplanationLink: {
            ...good,
            sotd: {
                ...good.sotd,
                rescindLink:
                    'https://www.w3.org/2016/11/fake-obsoleting-rescinding/',
            },
        },
    },
};
