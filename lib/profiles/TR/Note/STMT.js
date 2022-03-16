import { config as baseConfig, rules as baseRules } from './note-base.js';

export const name = 'STMT';
export const config = {
    ...baseConfig,
    status: 'STMT',
    longStatus: 'Statement',
    styleSheet: 'W3C-STMT',
};
export const rules = baseRules;
