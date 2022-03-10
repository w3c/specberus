import noteBase from './noteBase';

const { draftStabilityRules, rules: baseRules } = noteBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRules,
    },
};
