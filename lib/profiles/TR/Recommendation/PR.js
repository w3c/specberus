exports.name = 'PR';
exports.config = {
    status: 'PR',
    longStatus: 'Proposed Recommendation',
    styleSheet: 'W3C-PR',
    track: 'Recommendation',
};

const profileUtil = require('../../profileUtil');
let rules = profileUtil.insertAfter(require('../../TR').rules, 'sotd.process-document', [
    require('../../../rules/sotd/ac-review'),
    require('../../../rules/sotd/review-end'),
    require('../../../rules/sotd/new-features'),
]);
rules = profileUtil.insertAfter(rules, 'sotd.supersedable', [
    require('../../../rules/sotd/diff'),
    require('../../../rules/structure/security-privacy'),
]);

exports.rules = rules;
