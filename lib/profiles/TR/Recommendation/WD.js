import * as draftStability from '../../../rules/sotd/draft-stability.js';
import { insertAfter } from '../../profileUtil.js';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base.js';

export const name = 'WD';
export const config = {
    ...baseConfig,
    status: 'WD',
    longStatus: 'Working Draft',
    styleSheet: 'W3C-WD',
};

export const rules = insertAfter(baseRules, 'sotd.supersedable', [
    draftStability,
]);
