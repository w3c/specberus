import draftStability from '../../../rules/sotd/draft-stability';
import { insertAfter } from '../../profileUtil';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base';

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
