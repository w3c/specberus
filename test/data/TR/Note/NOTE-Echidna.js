import noteBase from './noteBase.js';

const { echidnaRules, rules: baseRules } = noteBase;

export const rules = {
    ...baseRules,
    echidna: echidnaRules,
};
