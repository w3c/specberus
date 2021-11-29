exports.name = 'CR';
const base = require('./recommendation-base');

// customize config
const config = {
    status: 'CR',
    longStatus: 'Candidate Recommendation',
    crType: 'Snapshot',
    styleSheet: 'W3C-CR',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');

const rules = profileUtil.removeRules(base.rules, 'sotd.draft-stability');

exports.rules = rules;
