exports.name = 'CRYD';
exports.config = {
    status: 'CRYD',
    longStatus: 'Draft Registry',
    previousVersion: false,
    styleSheet: 'CRYD',
    noteStatus: true,
};

// const base = require('../base');

const { rules } = require('./CRY');

// // remove pp from base.
// rules = base.removeRules(rules, 'sotd.pp');

exports.rules = rules;
