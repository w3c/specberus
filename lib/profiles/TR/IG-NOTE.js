exports.name = 'IG-NOTE';
exports.config = {
    status: 'NOTE',
    longStatus: 'Interest Group Note',
    previousVersion: true,
    styleSheet: 'W3C-IG-NOTE',
    stabilityWarning: true,
    noteStatus: true,
};

var base = require('../base'),
    rules = base.insertAfter(require('../TR').rules, 'sotd.pp', [
        require('../../rules/sotd/charter-disclosure'),
        require('../../rules/sotd/diff'),
        require('../../rules/sotd/deliverer-note'),
    ]);

rules = base.removeRules(rules, 'sotd.pp');
exports.rules = rules;
