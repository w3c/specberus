/* eslint-disable import/no-dynamic-require */
const {
    buildCommonViewData,
    buildSecurityPrivacy,
    buildDraftStability,
    data,
} = require('./recommendationBase');

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
        maybeUpdated: true,
        needImple: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/CRD?type=good
const good = { ...data, ...customData };

// Used in http://localhost:8001/doc-views/TR/Recommendation/CRD?type=good2
const good2 = {
    config: {
        ...good.config,
    },
    sotd: {
        ...good.sotd,
        draftText:
            'This document is maintained and updated at any time. Some parts of this document are work in progress.',
    },
};

module.exports = {
    good,
    good2,
    ...buildCommonViewData(good),
    'draft-stability': buildDraftStability(good),
    'security-privacy': buildSecurityPrivacy(good),
};
