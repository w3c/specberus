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
                errors: ['headers.dl.this-version'],
            },
            {
                data: 'noThisLinkExist',
                errors: ['headers.dl.not-found'],
            },
            {
                data: 'wrongThisSyntax',
                errors: ['headers.dl.this-syntax'],
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
