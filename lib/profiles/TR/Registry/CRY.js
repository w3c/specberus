// customize rules
import * as candidateReviewEnd from '../../../rules/sotd/candidate-review-end.js';
import { insertAfter } from '../../profileUtil.js';
import { config as baseConfig, rules as baseRules } from './registry-base.js';

export const name = 'CRY';
export const config = {
    ...baseConfig,
    status: 'CRY',
    longStatus: 'Candidate Registry',
    cryType: 'Snapshot',
    styleSheet: 'W3C-CRY',
};

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    candidateReviewEnd,
]);
