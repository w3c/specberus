import registryBase from './registryBase.js';

const { rules: baseRules, draftStabilityRulesForDraft } = registryBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRulesForDraft,
    },
    headers: {
        ...baseRules.headers,
        dl: [
            ...baseRules.headers.dl,
            {
                data: 'shortnameLowercase',
            },
        ],
    },
};
