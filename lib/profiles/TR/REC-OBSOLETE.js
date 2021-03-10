exports.name = 'REC-OBSOLETE';
exports.config = {
    status: 'OBSL',
    longStatus: 'Obsolete Recommendation',
    previousVersion: false,
    obsoletes: true,
    styleSheet: 'W3C-OBSL',
    stabilityWarning: false,
    recTrackStatus: true,
};

const base = require('../base');
let rules = base.insertAfter(require('../TR').rules, 'headers.dl', [
    require('../../rules/headers/errata'),
]);

rules = base.insertAfter(rules, 'sotd.supersedable', [
    require('../../rules/sotd/diff'),
    require('../../rules/sotd/obsl-rescind'),
]);

exports.rules = rules;
