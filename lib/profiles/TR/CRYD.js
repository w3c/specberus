exports.name = 'CRYD';
exports.config = {
    status: 'CRYD',
    longStatus: 'Candidate Registry',
    cryType: 'Draft',
    styleSheet: 'W3C-CRYD',
    track: 'Registry',
};

let { rules } = require('./CRY');
const base = require('../base');

rules = base.removeRules(rules, 'sotd.candidate-review-end');
rules = base.insertAfter(rules, 'sotd.supersedable', [
    require('../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
