import * as draftStability from '../../../rules/sotd/draft-stability';
import { insertAfter } from '../../profileUtil';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base';

export const name = 'CRD';
export const config = {
    ...baseConfig,
    status: 'CRD',
    longStatus: 'Candidate Recommendation',
    crType: 'Draft',
    styleSheet: 'W3C-CRD',
};

export const rules = insertAfter(baseRules, 'sotd.pp', [draftStability]);
