exports.name = 'REC';
const base = require('./recommendation-base');

// customize config
const config = {
    status: 'REC',
    longStatus: 'Recommendation',
    styleSheet: 'W3C-REC',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');
let rules = profileUtil.insertAfter(base.rules, 'headers.dl', [
    require('../../../rules/headers/errata'),
]);
rules = profileUtil.insertAfter(rules, 'sotd.supersedable', [
    require('../../../rules/sotd/rec-addition'),
    require('../../../rules/sotd/rec-comment-end'),
    require('../../../rules/sotd/new-features'),
    require('../../../rules/sotd/deployment'),
]);

rules = profileUtil.removeRules(rules, ['structure.security-privacy']);

exports.rules = rules;
