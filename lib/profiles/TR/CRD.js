exports.name = 'CRD';
exports.config = {
    status: 'CRD',
    longStatus: 'Candidate Recommendation',
    crType: 'Draft',
    styleSheet: 'W3C-CRD',
    stabilityWarning: true,
    track: 'Recommendation',
};

const base = require('../base');
const rules = base.removeRules(require('./CR').rules, 'sotd.cr-end');

exports.rules = rules;
