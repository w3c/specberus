import * as errata from '../../../rules/headers/errata';
import * as deployment from '../../../rules/sotd/deployment';
import * as newFeatures from '../../../rules/sotd/new-features';
import * as recAddition from '../../../rules/sotd/rec-addition';
import * as recCommentEnd from '../../../rules/sotd/rec-comment-end';
import { insertAfter, removeRules } from '../../profileUtil';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base';

export const name = 'REC';
export const config = {
    ...baseConfig,
    status: 'REC',
    longStatus: 'Recommendation',
    styleSheet: 'W3C-REC',
};

const rulesWithErrata = insertAfter(baseRules, 'headers.dl', [errata]);

const rulesWithOthers = insertAfter(rulesWithErrata, 'sotd.supersedable', [
    recAddition,
    recCommentEnd,
    newFeatures,
    deployment,
]);

export const rules = removeRules(rulesWithOthers, [
    'structure.security-privacy',
]);
