exports.name = 'CR';
exports.config = {
    status: 'CR',
    longStatus: 'Candidate Recommendation',
    crType: 'Snapshot',
    previousVersion: true,
    styleSheet: 'W3C-CR',
    stabilityWarning: true,
    recTrackStatus: true,
};

const base = require('../base');
let rules = base.insertAfter(require('../TR').rules, 'sotd.status', [
    require('../../rules/sotd/cr-end'),
    require('../../rules/sotd/publish'),
]);
rules = base.insertAfter(rules, 'sotd.supersedable', [
    require('../../rules/sotd/diff'),
    require('../../rules/structure/security-privacy'),
]);

rules = base.removeRules(rules, 'sotd.draft-stability');

exports.rules = rules;
