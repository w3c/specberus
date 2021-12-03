exports.name = 'CRY';
const base = require('./registry-base');

// customize config
const config = {
    status: 'CRY',
    longStatus: 'Candidate Registry',
    cryType: 'Snapshot',
    styleSheet: 'W3C-CRY',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/sotd/candidate-review-end'),
]);

exports.rules = rules;
