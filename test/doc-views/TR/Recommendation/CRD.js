/* eslint-disable import/no-dynamic-require */
const { data } = require('./recommendation-base');

const profile = 'CRD';
const {
    config,
} = require(`../../../../lib/profiles/TR/Recommendation/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isCRD: true,
        notEndorsed: true,
        // maybeUpdated: true,
        needImple: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/CRD?type=good
const good = { ...data, ...customData };
exports.good = good;

// Used in http://localhost:8001/doc-views/TR/Recommendation/CRD?type=good2
exports.good2 = {
    config: {
        ...good.config,
    },
    sotd: {
        ...good.sotd,
        draftText:
            'This document is maintained and updated at any time. Some parts of this document are work in progress.',
    },
};
