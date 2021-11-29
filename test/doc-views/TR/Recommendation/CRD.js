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

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.pp', [
    require('../../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
