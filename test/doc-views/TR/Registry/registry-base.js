exports.config = {
    track: 'Registry',
};

// customize rules
const base = require('../../TR');
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.supersedable', [
    require('../../../rules/sotd/usage'),
]);

exports.rules = rules;
