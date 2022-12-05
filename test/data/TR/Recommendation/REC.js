import recommendationBase from './recommendationBase.js';

const {
    rules: baseRules,
    newFeaturesRules,
    recStabilityRules,
} = recommendationBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        stability: recStabilityRules,
        deployment: [
            {
                data: 'noDeployment',
                errors: ['sotd.deployment.not-found'],
            },
        ],
        'new-features': newFeaturesRules,
        'rec-comment-end': [
            {
                data: 'noCommentEnd',
                errors: ['sotd.rec-comment-end.not-found'],
            },
            {
                data: 'foundMulti',
                warnings: ['sotd.rec-comment-end.multi-found'],
            },
            {
                data: 'notFound',
                errors: ['sotd.rec-comment-end.not-found'],
            },
        ],
        'rec-addition': [
            {
                data: 'wrongText',
                errors: ['sotd.rec-addition.wrong-text'],
            },
            {
                data: 'noSection',
                errors: ['sotd.rec-addition.no-section'],
            },
            {
                data: 'unnecessarySection',
                errors: ['sotd.rec-addition.unnecessary-section'],
            },
        ],
    },
    headers: {
        ...baseRules.headers,
        errata: [
            {
                data: 'noErrata',
                errors: ['headers.errata.no-errata'],
            },
            {
                data: 'recWithProposedSubChanges',
                errors: [],
            },
            {
                data: 'recWithProposedNewChanges',
                errors: [],
            },
            {
                data: 'recWithCandidateSubChanges',
                errors: [],
            },
            {
                data: 'recWithCandidateNewChanges',
                errors: [],
            },
        ],
        dl: [
            ...baseRules.headers.dl,
            {
                data: 'shortnameLowercase',
            },
        ],
    },
};
