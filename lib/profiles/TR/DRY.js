exports.name = 'DRY';
exports.config = {
    status: 'DRY',
    longStatus: 'Draft Registry',
    styleSheet: 'DRY',
    track: 'RY',
};

const { rules } = require('./RY');

// const base = require('../base');
// TODO: remove pp from base.
// rules = base.removeRules(rules, 'sotd.pp');

exports.rules = rules;
