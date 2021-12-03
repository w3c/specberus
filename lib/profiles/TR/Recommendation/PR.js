exports.name = 'PR';
const base = require('./recommendation-base');

// customize config
const config = {
    status: 'PR',
    longStatus: 'Proposed Recommendation',
    styleSheet: 'W3C-PR',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/sotd/ac-review'),
    require('../../../rules/sotd/review-end'),
    require('../../../rules/sotd/new-features'),
    require('../../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
