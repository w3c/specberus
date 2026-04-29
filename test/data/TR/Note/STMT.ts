import noteBase from './noteBase.js';

const { rules: baseRules } = noteBase;

export const rules = {
    ...baseRules,
    headers: {
        translation: [
            {
                data: 'noTranslation',
                errors: ['headers.translation.not-found'],
            },
        ],
    },
};
