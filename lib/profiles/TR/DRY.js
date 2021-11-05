exports.name = 'DRY';
exports.config = {
    status: 'DRY',
    longStatus: 'Draft Registry',
    styleSheet: 'W3C-DRY',
    track: 'Registry',
    stabilityWarning: true,
};

const { rules } = require('./RY');

exports.rules = rules;
