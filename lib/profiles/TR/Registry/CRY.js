exports.name = 'CRY';
exports.config = {
    status: 'CRY',
    longStatus: 'Candidate Registry',
    cryType: 'Snapshot',
    styleSheet: 'W3C-CRY',
    track: 'Registry',
};

const profileUtil = require('../../profileUtil');
let rules = profileUtil.insertAfter(require('./RY').rules, 'sotd.process-document', [
    require('../../../rules/sotd/candidate-review-end'),
]);

rules = profileUtil.removeRules(rules, 'sotd.draft-stability');

exports.rules = rules;
