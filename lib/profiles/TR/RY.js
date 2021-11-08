exports.name = 'RY';
exports.config = {
    status: 'RY',
    longStatus: 'Registry',
    styleSheet: 'W3C-RY',
    track: 'Registry',
    stabilityWarning: true,
};

const { rules } = require('../TR');

exports.rules = rules;
