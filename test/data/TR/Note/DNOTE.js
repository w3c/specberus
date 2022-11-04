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
        shortname: [
            ...baseRules.headers.shortname,
            {
                data: 'shortnameLowercaseFP',
                errors: ['headers.shortname.shortname-lowercase'],
            },
        ],
    },
};
