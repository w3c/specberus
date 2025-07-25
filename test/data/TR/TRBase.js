import { rules as baseRules } from '../specBase.js';

export const rules = {
    headers: {
        ...baseRules.headers,
        'github-repo': [
            {
                data: 'noFeedback',
                errors: ['headers.github-repo.no-feedback'],
            },
            {
                data: 'noRepo',
                errors: ['headers.github-repo.no-repo'],
            },
        ],
        copyright: [
            {
                data: 'noCopyright',
                errors: ['headers.copyright.not-found'],
            },
            {
                data: 'noMatchedCopyright',
                errors: ['headers.copyright.no-match'],
            },
            {
                data: 'wrongCopyrightLink',
                errors: ['headers.copyright.href-not-match'],
            },
            {
                data: 'copyrightExceptionFound',
                errors: [],
            },
            {
                data: 'copyrightExceptionNotFound',
                errors: ['headers.copyright.exception-no-html'],
            },
        ],
        'editor-participation': [
            {
                data: 'noEditorParticipation',
                errors: ['headers.editor-participation.not-participating'],
            },
        ],
    },
    style: {
        ...baseRules.style,
    },
    heuristic: {
        ...baseRules.heuristic,
    },
    links: {
        ...baseRules.links,
    },
    structure: {
        ...baseRules.structure,
    },
    sotd: {
        supersedable: [
            { data: 'noIntro', errors: ['sotd.supersedable.no-sotd-intro'] },
            { data: 'noTr', errors: ['sotd.supersedable.no-sotd-tr'] },
            { data: 'deprecated', warnings: ['sotd.supersedable.deprecated'] },
        ],
        'process-document': [
            {
                data: 'noProcess',
                errors: ['sotd.process-document.not-found'],
            },
            {
                data: 'duplicatedProcess',
                errors: ['sotd.process-document.multiple-times'],
            },
        ],
        charter: [
            {
                data: 'noGroup',
                errors: ['sotd.charter.no-group'],
            },
            {
                data: 'noCharter',
                errors: ['sotd.charter.no-charter'],
            },
        ],

        publish: [
            {
                data: 'noParagraph',
                errors: ['sotd.publish.not-found'],
            },
            {
                data: 'noMatchUrl',
                errors: ['sotd.publish.url-not-match'],
            },
            {
                data: 'noHomepageLink',
                errors: ['sotd.publish.no-homepage-link'],
            },
        ],
        stability: [
            {
                data: 'noStability',
                errors: ['sotd.stability.no-stability'],
            },
        ],
        pp: [
            {
                data: 'jointPublication',
                config: {
                    patentPolicy: 'pp2020',
                },
                errors: ['sotd.pp.no-pp'],
                warnings: ['sotd.pp.joint-publication'],
            },
        ],
    },
    validation: {
        ...baseRules.validation,
    },
};

export const candidateReviewEndRules = [
    {
        data: 'noDateFound',
        errors: ['sotd.candidate-review-end.not-found'],
    },
    {
        data: 'multipleDateFound',
        warnings: ['sotd.candidate-review-end.multiple-found'],
    },
    {
        data: 'invalidDate',
        errors: ['sotd.candidate-review-end.found-not-valid'],
    },
];

export const echidnaRules = {
    'todays-date': [
        {
            data: 'noDateDetected',
            errors: ['echidna.todays-date.date-not-detected'],
        },
        {
            data: 'wrongDate',
            errors: ['echidna.todays-date.wrong-date'],
        },
    ],
    'deliverer-change': [
        {
            data: 'delivererChanged',
            errors: ['echidna.deliverer-change.deliverer-changed'],
        },
    ],
};

export const draftStabilityRules = [
    {
        data: 'noDraft',
        errors: ['sotd.draft-stability.not-found'],
    },
];

export const draftStabilityRulesForDraft = [
    {
        data: 'noDraftEither',
        errors: ['sotd.draft-stability.not-found-either'],
    },
];

export const newFeaturesRules = [
    {
        data: 'noWarning',
        warnings: ['sotd.new-features.no-warning'],
    },
    {
        data: 'noLink',
        errors: ['sotd.new-features.no-link'],
    },
];
