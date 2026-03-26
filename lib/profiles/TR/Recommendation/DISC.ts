// customize rules
import type { SpecberusConfig } from '../../../types.js';
import { removeRules } from '../../profileUtil.js';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base.js';

export const name = 'DISC';
export const config: SpecberusConfig = {
    ...baseConfig,
    status: 'DISC',
    longStatus: 'Discontinued Draft',
    styleSheet: 'W3C-DISC',
};

export const rules = removeRules(baseRules, [
    'headers.editor-participation',
    'structure.security-privacy',
    'sotd.diff',
]);
