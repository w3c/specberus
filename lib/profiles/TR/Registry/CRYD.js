exports.name = 'CRYD';
exports.config = {
    status: 'CRYD',
    longStatus: 'Candidate Registry',
    cryType: 'Draft',
    styleSheet: 'W3C-CRYD',
    track: 'Registry',
};

let { rules } = require('./CRY');
const profileUtil = require('../../profileUtil');

rules = profileUtil.removeRules(rules, 'sotd.candidate-review-end');
rules = profileUtil.insertAfter(rules, 'sotd.supersedable', [
    require('../../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
