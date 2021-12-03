exports.name = 'REC-RSCND';
const base = require('./REC');

// customize config
const config = {
    status: 'REC',
    longStatus: 'Rescinded Recommendation',
    rescinds: true,
    styleSheet: 'W3C-RSCND',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/echidna/todays-date'),
]);

exports.rules = rules;
