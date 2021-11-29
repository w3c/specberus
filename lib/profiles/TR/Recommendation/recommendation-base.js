exports.config = {
    track: 'Recommendation',
};

const profileUtil = require('../../profileUtil');

let rules = profileUtil.insertAfter(
    require('../../TR').rules,
    'sotd.process-document',
    [require('../../../rules/sotd/candidate-review-end')]
);
rules = profileUtil.insertAfter(rules, 'sotd.supersedable', [
    require('../../../rules/sotd/diff'),
    require('../../../rules/structure/security-privacy'),
]);

exports.rules = rules;
