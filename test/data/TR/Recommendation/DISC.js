const { rules } = require('./recommendationBase');

exports.rules = {
    ...rules,
    sotd: {
        ...rules.sotd,
        stability: [
            ...rules.sotd.stability,
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
