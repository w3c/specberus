import noteBase from './noteBase.js';

const { draftStabilityRules, rules: baseRules } = noteBase;

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
