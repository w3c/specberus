import * as candidateReviewEnd from '../../../rules/sotd/candidate-review-end.js';
import { insertAfter } from '../../profileUtil.js';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base.js';

export const name = 'CR';
export const config = {
    ...baseConfig,
    status: 'CR',
    longStatus: 'Candidate Recommendation',
    crType: 'Snapshot',
    styleSheet: 'W3C-CR',
};

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    candidateReviewEnd,
]);
