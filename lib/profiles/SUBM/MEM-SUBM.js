import memsubCopyright from '../../rules/headers/memsub-copyright';
import submission from '../../rules/sotd/submission';
import { insertAfter } from '../profileUtil';
import { rules as baseRules } from '../SUBM';

export const name = 'MEM-SUBM';
export const config = {
    status: 'SUBM',
    longStatus: 'Member Submission',
    styleSheet: 'W3C-Member-SUBM',
    submissionType: 'member',
};

const rulesWithAdditionalHeaderRule = insertAfter(
    baseRules,
    'headers.w3c-state',
    [memsubCopyright]
);

export const rules = insertAfter(
    rulesWithAdditionalHeaderRule,
    'sotd.supersedable',
    submission
);
