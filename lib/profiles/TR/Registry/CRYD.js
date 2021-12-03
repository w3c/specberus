exports.name = 'CRYD';
const base = require('./registry-base');

// customize config
const config = {
    status: 'CRYD',
    longStatus: 'Candidate Registry',
    cryType: 'Draft',
    styleSheet: 'W3C-CRYD',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');

let rules = profileUtil.removeRules(base.rules, 'sotd.candidate-review-end');
rules = profileUtil.insertAfter(rules, 'sotd.supersedable', [
    require('../../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
