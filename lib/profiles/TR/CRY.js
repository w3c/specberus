exports.name = 'CRY';
exports.config = {
    status: 'CRY',
    longStatus: 'Draft Registry',
    previousVersion: false,
    styleSheet: 'CRY',
    noteStatus: true,
};

// const base = require('../base');

const { rules } = require('./RY');

// // remove pp from base.
// rules = base.removeRules(rules, 'sotd.pp');

exports.rules = rules;
