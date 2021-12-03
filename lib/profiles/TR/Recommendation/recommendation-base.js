exports.config = {
    track: 'Recommendation',
};

// customize rules
const base = require('../../TR');
const profileUtil = require('../../profileUtil');
let rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/sotd/candidate-review-end'),
]);
rules = profileUtil.insertAfter(rules, 'sotd.supersedable', [
    require('../../../rules/sotd/diff'),
    require('../../../rules/structure/security-privacy'),
]);

exports.rules = rules;
