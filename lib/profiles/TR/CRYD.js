exports.name = 'CRYD';
exports.config = {
    status: 'CRYD',
    longStatus: 'Draft Registry',
    styleSheet: 'CRYD',
    track: 'RY',
};

// const base = require('../base');

const { rules } = require('./CRY');

// // remove pp from base.
// rules = base.removeRules(rules, 'sotd.pp');

exports.rules = rules;
