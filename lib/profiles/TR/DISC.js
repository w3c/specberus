exports.name = 'DISC';
exports.config = {
    status: 'DISC',
    longStatus: 'Discontinued Draft',
    styleSheet: 'W3C-DISC',
    track: 'Recommendation',
};

const base = require('../base');
const rules = base.removeRules(require('../TR').rules, 'sotd.draft-stability');

exports.rules = rules;
