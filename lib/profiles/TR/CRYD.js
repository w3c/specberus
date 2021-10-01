exports.name = 'CRYD';
exports.config = {
    status: 'CRYD',
    longStatus: 'Candidate Registry Draft',
    styleSheet: 'W3C-CRYD',
    track: 'Registry',
};

let { rules } = require('./CRY');
const base = require('../base');

rules = base.removeRules(rules, 'sotd.candidate-review-end');

exports.rules = rules;
