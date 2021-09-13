exports.name = 'RY';
exports.config = {
    status: 'RY',
    longStatus: 'Registry',
    styleSheet: 'RY',
};

// const base = require('../base');

const { rules } = require('../TR');

// TODO: remove pp from base.
// rules = base.removeRules(rules, 'sotd.pp');

exports.rules = rules;
