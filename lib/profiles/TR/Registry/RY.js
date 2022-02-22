import usage from '../../../rules/sotd/usage';
import { insertAfter } from '../../profileUtil';
import { config as baseConfig, rules as baseRules } from './registry-base';

export const name = 'RY';
export const config = {
    ...baseConfig,
    status: 'RY',
    longStatus: 'Registry',
    styleSheet: 'W3C-RY',
};

export const rules = insertAfter(baseRules, 'sotd.supersedable', [usage]);
