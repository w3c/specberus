exports.name = 'MEM-SUBM';
exports.config = {
    status: 'SUBM',
    longStatus: 'Member Submission',
    styleSheet: 'W3C-Member-SUBM',
    stabilityWarning: false,
    submissionType: 'member',
};

const base = require('../base');
let rules = base.insertAfter(require('../SUBM').rules, 'headers.w3c-state', [
    require('../../rules/headers/memsub-copyright'),
]);
rules = base.insertAfter(
    rules,
    'sotd.supersedable',
    require('../../rules/sotd/submission')
);

exports.rules = rules;
