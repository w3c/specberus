exports.name = 'RY';
const base = require('./registry-base');

// customize config
const config = {
    status: 'RY',
    longStatus: 'Registry',
    styleSheet: 'W3C-RY',
};
exports.config = { ...base.config, ...config };

exports.rules = base.rules;
