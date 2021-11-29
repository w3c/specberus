exports.name = 'DRY';
exports.config = {
    status: 'DRY',
    longStatus: 'Draft Registry',
    styleSheet: 'W3C-DRY',
    track: 'Registry',
};

let { rules } = require('./RY');
const profileUtil = require('../../profileUtil');

rules = profileUtil.insertAfter(rules, 'sotd.supersedable', [
    require('../../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
