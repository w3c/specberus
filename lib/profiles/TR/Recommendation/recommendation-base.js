import diff from '../../../rules/sotd/diff';
import securityPrivacy from '../../../rules/structure/security-privacy';
import { insertAfter } from '../../profileUtil';
import { rules as baseRules } from '../../TR';

export const config = {
    track: 'Recommendation',
};

export const rules = insertAfter(baseRules, 'sotd.supersedable', [
    diff,
    securityPrivacy,
]);
