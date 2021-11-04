exports.name = 'DISC';
exports.config = {
    status: 'DISC',
    longStatus: 'Discontinued Draft',
    styleSheet: 'W3C-DISC',
    stabilityWarning: true,
    track: 'Recommendation',
};

const base = require('../base');
let rules = base.insertAfter(require('../TR').rules, 'sotd.supersedable', [
    require('../../rules/structure/security-privacy'),
]);

rules = base.removeRules(rules, 'sotd.draft-stability');

exports.rules = rules;
