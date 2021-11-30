exports.name = 'CRD';
exports.config = {
    status: 'CRD',
    longStatus: 'Candidate Recommendation',
    crType: 'Draft',
    styleSheet: 'W3C-CRD',
    track: 'Recommendation',
};

const base = require('../base');
let rules = base.removeRules(
    require('./CR').rules,
    'sotd.candidate-review-end'
);

rules = base.insertAfter(rules, 'sotd.supersedable', [
    require('../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
