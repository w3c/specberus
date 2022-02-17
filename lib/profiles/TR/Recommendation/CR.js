import candidateReviewEnd from '../../../rules/sotd/candidate-review-end';
import { insertAfter } from '../../profileUtil';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base';

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
