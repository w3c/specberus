import * as acReview from '../../../rules/sotd/ac-review.js';
import * as draftStability from '../../../rules/sotd/draft-stability.js';
import * as newFeatures from '../../../rules/sotd/new-features.js';
import * as reviewEnd from '../../../rules/sotd/review-end.js';
import { insertAfter } from '../../profileUtil.js';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base.js';

export const name = 'PR';
export const config = {
    ...baseConfig,
    status: 'PR',
    longStatus: 'Proposed Recommendation',
    styleSheet: 'W3C-PR',
};

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    acReview,
    reviewEnd,
    newFeatures,
    draftStability,
]);
