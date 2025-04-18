import * as errata from '../../../rules/headers/errata.js';
import * as translation from '../../../rules/headers/translation.js';
import * as deployment from '../../../rules/sotd/deployment.js';
import * as newFeatures from '../../../rules/sotd/new-features.js';
import * as recAddition from '../../../rules/sotd/rec-addition.js';
import * as recCommentEnd from '../../../rules/sotd/rec-comment-end.js';
import { insertAfter, removeRules } from '../../profileUtil.js';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base.js';

export const name = 'REC';
export const config = {
    ...baseConfig,
    status: 'REC',
    longStatus: 'Recommendation',
    styleSheet: 'W3C-REC',
};

const rulesWithErrataTranslation = insertAfter(baseRules, 'headers.dl', [
    errata,
    translation,
]);

const rulesWithOthers = insertAfter(
    rulesWithErrataTranslation,
    'sotd.supersedable',
    [recAddition, recCommentEnd, newFeatures, deployment]
);

export const rules = removeRules(rulesWithOthers, [
    'structure.security-privacy',
]);
