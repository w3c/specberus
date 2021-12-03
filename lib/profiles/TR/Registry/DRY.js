exports.name = 'DRY';
const base = require('./registry-base');

// customize config
const config = {
    status: 'DRY',
    longStatus: 'Draft Registry',
    styleSheet: 'W3C-DRY',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.supersedable', [
    require('../../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
