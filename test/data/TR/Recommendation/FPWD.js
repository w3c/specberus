import recommendationBase from './recommendationBase.js';

const { rules: baseRules, draftStabilityRules } = recommendationBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRules,
    },
    headers: {
        ...baseRules.headers,
        dl: [
            ...baseRules.headers.dl,
            {
                data: 'shortnameLowercase',
                errors: ['headers.dl.shortname-lowercase'],
            },
        ],
    },
};
