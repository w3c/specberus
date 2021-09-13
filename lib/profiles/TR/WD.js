// Working Draft profile

exports.name = 'WD';
exports.config = {
    status: 'WD',
    longStatus: 'Working Draft',
    styleSheet: 'W3C-WD',
    stabilityWarning: true,
    track: 'REC',
};

const base = require('../base');
const rules = base.insertAfter(require('../TR').rules, 'sotd.supersedable', [
    require('../../rules/sotd/diff'),
    require('../../rules/structure/security-privacy'),
]);

exports.rules = rules;
