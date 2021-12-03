exports.name = 'CRD';
const base = require('./recommendation-base');

// customize config
const config = {
    status: 'CRD',
    longStatus: 'Candidate Recommendation',
    crType: 'Draft',
    styleSheet: 'W3C-CRD',
};
exports.config = { ...base.config, ...config };

exports.rules = base.rules;
