exports.name = 'NOTE';
exports.config = {
    status: 'NOTE',
    longStatus: 'Note',
    previousVersion: true,
    styleSheet: 'NOTE',
    stabilityWarning: true,
    noteStatus: true,
};

const base = require('../base');

let rules = base.insertAfter(require('../TR').rules, 'sotd.pp', [
    require('../../rules/sotd/diff'),
    require('../../rules/sotd/deliverer-note'),
]);

// remove pp from base.
rules = base.removeRules(rules, 'sotd.pp');

exports.rules = rules;
