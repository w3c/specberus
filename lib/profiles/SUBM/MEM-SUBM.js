exports.name = 'MEM-SUBM';
exports.config = {
    status: 'SUBM',
    longStatus: 'Member Submission',
    previousVersion: false,
    styleSheet: 'W3C-Member-SUBM',
    stabilityWarning: false,
    submissionType: 'member',
};

var base = require('../base');
var rules = base.insertAfter(require('../SUBM').rules, 'headers.h2-status', [
    require('../../rules/headers/memsub-copyright'),
]);
rules = base.insertAfter(
    rules,
    'sotd.supersedable',
    require('../../rules/sotd/submission')
);

exports.rules = rules;
