exports.config = {
    track: 'Recommendation',
};

// customize rules
const base = require('../../TR');

const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.supersedable', [
    require('../../../rules/sotd/diff'),
    require('../../../rules/structure/security-privacy'),
]);

exports.rules = rules;
