exports.name = 'DISC';
const base = require('./recommendation-base');

// customize config
const config = {
    status: 'DISC',
    longStatus: 'Discontinued Draft',
    styleSheet: 'W3C-DISC',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');

const rules = profileUtil.removeRules(base.rules, [
    'structure.security-privacy',
    'sotd.diff',
]);

exports.rules = rules;
