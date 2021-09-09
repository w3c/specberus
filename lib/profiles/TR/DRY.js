exports.name = 'DRY';
exports.config = {
    status: 'DRY',
    longStatus: 'Draft Registry',
    previousVersion: false,
    styleSheet: 'DRY',
    noteStatus: true,
};

// const base = require('../base');

const { rules } = require('./RY');

// // remove pp from base.
// rules = base.removeRules(rules, 'sotd.pp');

exports.rules = rules;
