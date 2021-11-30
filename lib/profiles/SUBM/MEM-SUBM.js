exports.name = 'MEM-SUBM';
exports.config = {
    status: 'SUBM',
    longStatus: 'Member Submission',
    styleSheet: 'W3C-Member-SUBM',
    submissionType: 'member',
};

<<<<<<< HEAD
const profileUtil = require('../profileUtil');
let rules = profileUtil.insertAfter(
    require('../SUBM').rules,
    'headers.w3c-state',
    [require('../../rules/headers/memsub-copyright')]
);
=======
const profileUtil = require('../../profileUtil');
let rules = profileUtil.insertAfter(require('../SUBM').rules, 'headers.w3c-state', [
    require('../../rules/headers/memsub-copyright'),
]);
>>>>>>> Revert "Revert "make track/profiles work""
rules = profileUtil.insertAfter(
    rules,
    'sotd.supersedable',
    require('../../rules/sotd/submission')
);

exports.rules = rules;
