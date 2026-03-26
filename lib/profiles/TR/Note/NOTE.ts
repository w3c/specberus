import type { SpecberusConfig } from '../../../types.js';
import { config as baseConfig, rules as baseRules } from './note-base.js';

export const name = 'NOTE';
export const config: SpecberusConfig = {
    ...baseConfig,
    status: 'NOTE',
    longStatus: 'Group Note',
    styleSheet: 'W3C-NOTE',
};

export const rules = baseRules;
