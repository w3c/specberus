import noteBase from './noteBase';

const { echidnaRules, rules: baseRules } = noteBase;

export const rules = {
    ...baseRules,
    echidna: echidnaRules,
};
