exports.name = 'RY';
exports.config = {
    status: 'RY',
    longStatus: 'Registry',
    previousVersion: true,
    styleSheet: 'RY',
    noteStatus: true,
};

// const base = require('../base');

const { rules } = require('../TR');

// // remove pp from base.
// rules = base.removeRules(rules, 'sotd.pp');

exports.rules = rules;
