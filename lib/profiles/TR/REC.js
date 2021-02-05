exports.name = 'REC';
exports.config = {
    status: 'REC',
    longStatus: 'Recommendation',
    previousVersion: true,
    styleSheet: 'W3C-REC',
    stabilityWarning: 'REC',
    recTrackStatus: true,
};

var base = require('../base');
var rules = base.insertAfter(require('../TR').rules, 'headers.dl', [
    require('../../rules/headers/errata'),
]);
rules = base.insertAfter(rules, 'sotd.supersedable', [
    require('../../rules/sotd/diff'),
    require('../../rules/sotd/rec-addition'),
    require('../../rules/sotd/rec-comment-end'),
    require('../../rules/sotd/publish'),
    require('../../rules/sotd/new-features'),
]);

exports.rules = rules;
