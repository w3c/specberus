exports.name = 'RY';
exports.config = {
    status: 'RY',
    longStatus: 'Registry',
    styleSheet: 'W3C-RY',
    track: 'Registry',
};

let { rules } = require('../../TR');
const profileUtil = require('../../profileUtil');

rules = profileUtil.removeRules(rules, ['sotd.draft-stability']);
rules = profileUtil.insertAfter(rules, 'sotd.supersedable', [
    require('../../../rules/sotd/usage'),
]);

exports.rules = rules;
