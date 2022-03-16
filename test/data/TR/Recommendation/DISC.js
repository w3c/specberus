import recommendationBase from './recommendationBase.js';

const { rules: baseRules } = recommendationBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        stability: [
            ...baseRules.sotd.stability,
            {
                data: 'noCRReview',
                config: {
                    crType: 'Snapshot',
                },
                errors: ['sotd.stability.no-cr-review'],
            },
        ],
    },
};
