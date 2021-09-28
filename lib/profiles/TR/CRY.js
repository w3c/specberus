exports.name = 'CRY';
exports.config = {
    status: 'CRY',
    longStatus: 'Candidate Registry',
    styleSheet: 'CRY',
    track: 'Registry',
};

const base = require('../base');
const rules = base.insertAfter(require('./RY').rules, 'sotd.status', [
    require('../../rules/sotd/candidate-review-end'),
]);

exports.rules = rules;
