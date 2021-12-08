exports.name = 'FPWD';
const base = require('./recommendation-base');

// customize config
const config = {
    status: 'WD',
    longStatus: 'First Public Working Draft',
    styleSheet: 'W3C-WD',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');
let rules = profileUtil.insertAfter(base.rules, 'sotd.pp', [
    require('../../../rules/sotd/draft-stability'),
]);

rules = profileUtil.removeRules(rules, [
    'structure.security-privacy',
    'sotd.diff',
]);

exports.rules = rules;
