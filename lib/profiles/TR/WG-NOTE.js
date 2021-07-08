exports.name = 'WG-NOTE';
exports.config = {
    status: 'NOTE',
    longStatus: 'Working Group Note',
    previousVersion: true,
    styleSheet: 'W3C-WG-NOTE',
    stabilityWarning: true,
    noteStatus: true,
};

const base = require('../base');

exports.rules = base.insertAfter(require('../TR').rules, 'sotd.pp', [
    require('../../rules/sotd/diff'),
    require('../../rules/sotd/deliverer-note'),
]);
