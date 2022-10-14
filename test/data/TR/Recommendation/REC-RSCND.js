import recommendationBase from './recommendationBase.js';

const { recStabilityRules, rules: baseRules } = recommendationBase;

export const rules = {
    ...baseRules,
    headers: {
        ...baseRules.headers,
        dl: [
            ...baseRules.headers.dl.filter(
                v =>
                    ![
                        'wrongThisVersionHead',
                        'noRescindsNeeded',
                        'noThisLinkExist',
                        'wrongThisSyntax',
                    ].find(x => x === v.data)
            ),
            {
                data: 'wrongThisVersionHead',
                errors: [
                    'headers.dl.this-version',
                    'headers.dl.this-latest-shortname',
                    'headers.dl.history-syntax',
                    'headers.dl.this-rescinds-shortname',
                ],
            },
            {
                data: 'noThisLinkExist',
                errors: [
                    'headers.dl.not-found',
                    'headers.dl.this-latest-shortname',
                    'headers.dl.history-syntax',
                    'headers.dl.this-rescinds-shortname',
                ],
            },
            {
                data: 'wrongThisSyntax',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.this-latest-shortname',
                    'headers.dl.history-syntax',
                    'headers.dl.this-rescinds-shortname',
                ],
            },
        ],
    },
    sotd: {
        ...baseRules.sotd,
        stability: recStabilityRules,
        'obsl-rescind': [
            {
                data: 'noRationale',
                errors: ['sotd.obsl-rescind.no-rationale'],
            },
            {
                data: 'noExplanationLink',
                errors: ['sotd.obsl-rescind.no-explanation-link'],
            },
        ],
    },
};
