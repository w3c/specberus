exports.name = 'DRY';
exports.config = {
    status: 'DRY',
    longStatus: 'Draft Registry',
    styleSheet: 'W3C-DRY',
    track: 'Registry',
};

const { rules } = require('./RY');

exports.rules = rules;
