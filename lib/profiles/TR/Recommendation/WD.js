// Working Draft profile

exports.name = 'WD';
const base = require('./recommendation-base');

// customize config
const config = {
    status: 'WD',
    longStatus: 'Working Draft',
    styleSheet: 'W3C-WD',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.supersedable', [
    require('../../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
