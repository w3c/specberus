exports.name = 'MEM-SUBM';
exports.config = {
    status: 'SUBM',
    longStatus: 'Member Submission',
    styleSheet: 'W3C-Member-SUBM',
    submissionType: 'member',
};

const profileUtil = require('../profileUtil');
let rules = profileUtil.insertAfter(
    require('../SUBM').rules,
    'headers.w3c-state',
    [require('../../rules/headers/memsub-copyright')]
);
rules = profileUtil.insertAfter(
    rules,
    'sotd.supersedable',
    require('../../rules/sotd/submission')
);

exports.rules = rules;
