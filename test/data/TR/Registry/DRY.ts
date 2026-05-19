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
                errors: [
                    'headers.dl.this-version',
                    'headers.dl.latest-version',
                    'headers.dl.no-history',
                    'generic.sotd.not-found',
                    'headers.dl.editor-not-found',
                ],
            },
        ],
    },
};
