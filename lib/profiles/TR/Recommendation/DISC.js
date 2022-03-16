// customize rules
import { removeRules } from '../../profileUtil.js';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base.js';

export const name = 'DISC';
export const config = {
    ...baseConfig,
    status: 'DISC',
    longStatus: 'Discontinued Draft',
    styleSheet: 'W3C-DISC',
};

export const rules = removeRules(baseRules, [
    'structure.security-privacy',
    'sotd.diff',
]);
