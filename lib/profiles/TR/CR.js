exports.name = 'CR';
exports.config = {
    status: 'CR',
    longStatus: 'Candidate Recommendation',
    crType: 'Snapshot',
    styleSheet: 'W3C-CR',
    track: 'Recommendation',
};

const base = require('../base');
let rules = base.insertAfter(require('../TR').rules, 'sotd.process-document', [
    require('../../rules/sotd/candidate-review-end'),
]);
rules = base.insertAfter(rules, 'sotd.supersedable', [
    require('../../rules/sotd/diff'),
    require('../../rules/structure/security-privacy'),
]);

rules = base.removeRules(rules, 'sotd.draft-stability');

exports.rules = rules;
