exports.name = 'REC';
exports.config = {
    status: 'REC',
    longStatus: 'Recommendation',
    styleSheet: 'W3C-REC',
    track: 'Recommendation',
};

const base = require('../base');
let rules = base.insertAfter(require('../TR').rules, 'headers.dl', [
    require('../../rules/headers/errata'),
]);
rules = base.insertAfter(rules, 'sotd.supersedable', [
    require('../../rules/sotd/diff'),
    require('../../rules/sotd/rec-addition'),
    require('../../rules/sotd/rec-comment-end'),
    require('../../rules/sotd/new-features'),
    require('../../rules/sotd/deployment'),
]);

rules = base.removeRules(rules, ['sotd.draft-stability']);

exports.rules = rules;
