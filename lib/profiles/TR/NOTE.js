exports.name = 'NOTE';
exports.config = {
    status: 'NOTE',
    longStatus: 'Group Note',
    styleSheet: 'NOTE',
    stabilityWarning: true,
    track: 'Note',
};

const base = require('../base');

let rules = base.insertAfter(require('../TR').rules, 'sotd.pp', [
    require('../../rules/sotd/deliverer-note'),
]);

// Notes are treated as 'stable' and doesn't need 'draft-stability' rule.
rules = base.removeRules(rules, 'sotd.draft-stability');

exports.rules = rules;
