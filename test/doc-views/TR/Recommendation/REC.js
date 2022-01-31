/* eslint-disable import/no-dynamic-require */
const {
    buildCommonViewData,
    buildNewFeatures,
    data,
    buildRecStability,
} = require('./recommendationBase');

const profile = 'REC';
const {
    config,
} = require(`../../../../lib/profiles/TR/Recommendation/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        isREC: true,
        notEndorsed: false,
        hasLicensing: true,
        needImple: true,
        needErrata: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/REC?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);

module.exports = {
    good,
    ...common,
    stability: buildRecStability(good),
    errata: {
        noErrata: {
            ...good,
            config: {
                ...good.config,
                needErrata: false,
            },
        },
    },
    deployment: {
        noDeployment: {
            ...good,
            config: {
                ...good.config,
                isREC: false,
            },
        },
    },
    'new-features': buildNewFeatures(good),
    'rec-comment-end': {
        noCommentEnd: {
            ...good,
            sotd: {
                ...good.sotd,
                rec: {
                    ...good.sotd.rec,
                    showProposedAdd: true,
                },
                processHTML:
                    '<abbr title="World Wide Web Consortium">W3C</abbr> Process Document',
            },
        },
        foundMulti: {
            ...good,
            sotd: {
                ...good.sotd,
                rec: {
                    ...good.sotd.rec,
                    showProposedAdd: true,
                },
                processHTML:
                    '2 November 2023, 3 November 2023 <abbr title="World Wide Web Consortium">W3C</abbr> Process Document',
            },
        },
        notFound: {
            ...good,
            sotd: {
                ...good.sotd,
                rec: {
                    ...good.sotd.rec,
                    showProposedAdd: true,
                },
                processHTML:
                    '2 November 2021 <abbr title="World Wide Web Consortium">W3C</abbr> Process Document',
            },
        },
    },
    'rec-addition': {
        wrongText: {
            ...good,
            sotd: {
                ...good.sotd,
                rec: {
                    ...good.sotd.rec,
                    showProposedAdd: true,
                    showAddition: true,
                    addition: 'Wrong text',
                },
            },
        },
        noSection: {
            ...good,
            sotd: {
                ...good.sotd,
                rec: {
                    ...good.sotd.rec,
                    showProposedAdd: true,
                },
            },
        },
        unnecessarySection: {
            ...good,
            sotd: {
                ...good.sotd,
                rec: {
                    ...good.sotd.rec,
                    showAddition: true,
                },
            },
        },
    },
};
