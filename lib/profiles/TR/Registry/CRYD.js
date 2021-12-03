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

const rules = profileUtil.insertAfter(base.rules, 'sotd.supersedable', [
    require('../../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
