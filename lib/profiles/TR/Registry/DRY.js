import * as draftStability from '../../../rules/sotd/draft-stability.js';
import { insertAfter } from '../../profileUtil.js';
import { config as baseConfig, rules as baseRules } from './registry-base.js';

export const name = 'DRY';
export const config = {
    ...baseConfig,
    status: 'DRY',
    longStatus: 'Draft Registry',
    styleSheet: 'W3C-DRY',
};

export const rules = insertAfter(baseRules, 'sotd.supersedable', [
    draftStability,
]);
