import * as memsubCopyright from '../../rules/headers/memsub-copyright.js';
import * as submission from '../../rules/sotd/submission.js';
import { insertAfter, removeRules } from '../profileUtil.js';
import { rules as baseRules } from '../SUBM.js';

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
const rulesWithoutEditorParticipationRule = removeRules(
    rulesWithAdditionalHeaderRule,
    ['headers.editor-participation']
);

export const rules = insertAfter(
    rulesWithoutEditorParticipationRule,
    'sotd.supersedable',
    submission
);
