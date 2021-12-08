exports.name = 'RY';
const base = require('./registry-base');

// customize config
const config = {
    status: 'RY',
    longStatus: 'Registry',
    styleSheet: 'W3C-RY',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.supersedable', [
    require('../../../rules/sotd/usage'),
]);

exports.rules = rules;
