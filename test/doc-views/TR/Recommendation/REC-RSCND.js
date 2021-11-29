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
let rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/sotd/obsl-rescind'),
]);

rules = profileUtil.removeRules(rules, [
    'headers.errata',
    'sotd.stability',
    'sotd.publish',
    'sotd.pp',
    'sotd.charter',
    'sotd.diff',
    'sotd.rec-addition',
    'sotd.rec-comment-end',
    'sotd.new-features',
    'sotd.deployment',
]);

exports.rules = rules;
