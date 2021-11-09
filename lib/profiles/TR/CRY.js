exports.name = 'CRY';
exports.config = {
    status: 'CRY',
    longStatus: 'Candidate Registry',
    cryType: 'Snapshot',
    styleSheet: 'W3C-CRY',
    track: 'Registry',
};

const base = require('../base');
let rules = base.insertAfter(require('./RY').rules, 'sotd.process-document', [
    require('../../rules/sotd/candidate-review-end'),
]);

rules = base.removeRules(rules, 'sotd.draft-stability');

exports.rules = rules;
