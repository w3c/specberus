import * as draftStability from '../../../rules/sotd/draft-stability.js';
import { insertAfter, removeRules } from '../../profileUtil.js';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base.js';

export const name = 'FPWD';
export const config = {
    ...baseConfig,
    status: 'WD',
    longStatus: 'First Public Working Draft',
    styleSheet: 'W3C-WD',
};

const rulesWithOthers = insertAfter(baseRules, 'sotd.pp', [draftStability]);

export const rules = removeRules(rulesWithOthers, [
    'structure.security-privacy',
    'sotd.diff',
]);
