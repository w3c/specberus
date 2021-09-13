exports.name = 'NOTE';
exports.config = {
    status: 'NOTE',
    longStatus: 'Note',
    styleSheet: 'NOTE',
    stabilityWarning: true,
    track: 'NOTE',
};

const base = require('../base');

let rules = base.insertAfter(require('../TR').rules, 'sotd.pp', [
    require('../../rules/sotd/diff'),
    require('../../rules/sotd/deliverer-note'),
]);

// TODO: remove pp from base.
rules = base.removeRules(rules, 'sotd.pp');

exports.rules = rules;
