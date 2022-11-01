import registryBase from './registryBase.js';

const { rules: baseRules, draftStabilityRules } = registryBase;

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
                data: 'shortnameLowercaseFP',
                errors: ['headers.shortname.shortname-lowercase'],
            },
        ],
    },
};
