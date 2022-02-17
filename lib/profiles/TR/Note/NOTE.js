import { config as baseConfig, rules as baseRules } from './note-base';

export const name = 'NOTE';
export const config = {
    ...baseConfig,
    status: 'NOTE',
    longStatus: 'Group Note',
    styleSheet: 'W3C-NOTE',
};

export const rules = baseRules;
