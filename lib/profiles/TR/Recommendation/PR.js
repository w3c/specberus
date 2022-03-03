import * as acReview from '../../../rules/sotd/ac-review';
import * as draftStability from '../../../rules/sotd/draft-stability';
import * as newFeatures from '../../../rules/sotd/new-features';
import * as reviewEnd from '../../../rules/sotd/review-end';
import { insertAfter } from '../../profileUtil';
import {
    config as baseConfig,
    rules as baseRules,
} from './recommendation-base';

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
