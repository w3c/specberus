exports.name = 'PR';
exports.config = {
    status: 'PR',
    longStatus: 'Proposed Recommendation',
    styleSheet: 'W3C-PR',
    track: 'Recommendation',
};

const base = require('../base');
let rules = base.insertAfter(require('../TR').rules, 'sotd.process-document', [
    require('../../rules/sotd/ac-review'),
    require('../../rules/sotd/review-end'),
    require('../../rules/sotd/new-features'),
]);
rules = base.insertAfter(rules, 'sotd.supersedable', [
    require('../../rules/sotd/diff'),
    require('../../rules/structure/security-privacy'),
]);

exports.rules = rules;
