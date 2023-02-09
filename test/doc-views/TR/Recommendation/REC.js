import { config } from '../../../../lib/profiles/TR/Recommendation/REC.js';
import recommendationBase from './recommendationBase.js';

const { buildCommonViewData, buildNewFeatures, buildRecStability, data } =
    recommendationBase;

const profile = 'REC';
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

export default {
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
        recWithProposedSubChanges: {
            ...good,
            config: {
                ...good.config,
                needErrata: false,
            },
            sotd: {
                ...good.sotd,
                rec: {
                    ...good.sotd.rec,
                    showAddition: true,
                    addition: 'It includes proposed corrections.',
                },
            },
        },
        recWithProposedNewChanges: {
            ...good,
            config: {
                ...good.config,
                needErrata: false,
            },
            sotd: {
                ...good.sotd,
                rec: {
                    ...good.sotd.rec,
                    showProposedAdd: true,
                },
            },
        },
        recWithCandidateSubChanges: {
            ...good,
            config: {
                ...good.config,
                needErrata: false,
            },
            sotd: {
                ...good.sotd,
                rec: {
                    ...good.sotd.rec,
                    showAddition: true,
                    addition: 'It includes candidate corrections.',
                },
            },
        },
        recWithCandidateNewChanges: {
            ...good,
            config: {
                ...good.config,
                needErrata: false,
            },
            sotd: {
                ...good.sotd,
                rec: {
                    ...good.sotd.rec,
                    showAddition: true,
                    addition:
                        'It includes candidate additions, introducing new features since the previous Recommendation.',
                },
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
                    '2 November 2024, 3 November 2024 <abbr title="World Wide Web Consortium">W3C</abbr> Process Document',
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
