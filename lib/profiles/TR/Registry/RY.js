import * as usage from '../../../rules/sotd/usage.js';
import { insertAfter } from '../../profileUtil.js';
import { config as baseConfig, rules as baseRules } from './registry-base.js';

export const name = 'RY';
export const config = {
    ...baseConfig,
    status: 'RY',
    longStatus: 'Registry',
    styleSheet: 'W3C-RY',
};

export const rules = insertAfter(baseRules, 'sotd.supersedable', [usage]);
