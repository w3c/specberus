exports.name = 'CRD';
exports.config = {
    status: 'CRD',
    longStatus: 'Candidate Recommendation',
    crType: 'Draft',
    previousVersion: true,
    styleSheet: 'W3C-CRD',
    stabilityWarning: true,
    recTrackStatus: true,
};

var base = require('../base');
var rules = base.removeRules(require('./CR').rules, 'sotd.cr-end');

exports.rules = rules;
