exports.name = 'NOTE';
exports.config = {
    status: 'NOTE',
    longStatus: 'Group Note',
    styleSheet: 'NOTE',
    stabilityWarning: true,
    track: 'Note',
};

const base = require('../base');

const rules = base.insertAfter(require('../TR').rules, 'sotd.pp', [
    require('../../rules/sotd/diff'),
    require('../../rules/sotd/deliverer-note'),
    require('../../rules/sotd/note-not-endorsed'),
]);

exports.rules = rules;
