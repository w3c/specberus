// Working Draft profile

exports.name = 'WD';
const base = require('./recommendation-base');

// customize config
exports.config = {
    status: 'WD',
    longStatus: 'Working Draft',
    styleSheet: 'W3C-WD',
};

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.supersedable', [
    require('../../../rules/sotd/diff'),
    require('../../../rules/structure/security-privacy'),
]);

exports.rules = rules;
