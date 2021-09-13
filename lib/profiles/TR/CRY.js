exports.name = 'CRY';
exports.config = {
    status: 'CRY',
    longStatus: 'Draft Registry',
    styleSheet: 'CRY',
    track: 'RY',
};

// const base = require('../base');

const { rules } = require('./RY');

// // remove pp from base.
// rules = base.removeRules(rules, 'sotd.pp');

exports.rules = rules;
