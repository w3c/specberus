import noteBase from './noteBase.js';

const { draftStabilityRules, echidnaRules, rules: baseRules } = noteBase;

export const rules = {
    ...baseRules,
    sotd: {
        ...baseRules.sotd,
        'draft-stability': draftStabilityRules,
    },
    echidna: echidnaRules,
};
