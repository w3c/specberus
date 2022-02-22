// customize rules
import candidateReviewEnd from '../../../rules/sotd/candidate-review-end';
import { insertAfter } from '../../profileUtil';
import { config as baseConfig, rules as baseRules } from './registry-base';

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
