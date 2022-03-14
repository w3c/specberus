import * as diff from '../../../rules/sotd/diff.js';
import * as securityPrivacy from '../../../rules/structure/security-privacy.js';
import { insertAfter } from '../../profileUtil.js';
import { rules as baseRules } from '../../TR.js';

export const config = {
    track: 'Recommendation',
};

export const rules = insertAfter(baseRules, 'sotd.supersedable', [
    diff,
    securityPrivacy,
]);
