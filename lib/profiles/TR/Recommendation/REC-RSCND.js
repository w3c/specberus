import * as obslRescind from '../../../rules/sotd/obsl-rescind.js';
import { insertAfter, removeRules } from '../../profileUtil.js';
import { config as baseConfig, rules as baseRules } from './REC.js';

export const name = 'REC-RSCND';
export const config = {
    ...baseConfig,
    status: 'REC',
    longStatus: 'Rescinded Recommendation',
    rescinds: true,
    styleSheet: 'W3C-RSCND',
};

const rulesWithObslRescind = insertAfter(baseRules, 'sotd.process-document', [
    obslRescind,
]);

export const rules = removeRules(rulesWithObslRescind, [
    'headers.errata',
    'sotd.stability',
    'sotd.publish',
    'sotd.pp',
    'sotd.charter',
    'sotd.diff',
    'sotd.rec-addition',
    'sotd.rec-comment-end',
    'sotd.new-features',
    'sotd.deployment',
]);
