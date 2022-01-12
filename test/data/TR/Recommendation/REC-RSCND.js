/* eslint-disable import/no-dynamic-require */
const { data } = require('./REC').good;

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
exports.good = good;

// TODO?
