import noteBase from './noteBase.js';

export const { rules: baseRules } = noteBase;

export const rules = {
    ...baseRules,
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
