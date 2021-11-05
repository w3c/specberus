exports.name = 'CRY';
exports.config = {
    status: 'CRY',
    longStatus: 'Candidate Registry',
    styleSheet: 'W3C-CRY',
    track: 'Registry',
    stabilityWarning: true,
};

const base = require('../base');
let rules = base.insertAfter(require('./RY').rules, 'sotd.status', [
    require('../../rules/sotd/candidate-review-end'),
]);

rules = base.removeRules(rules, 'sotd.draft-stability');

exports.rules = rules;
