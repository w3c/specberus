exports.name = 'NOTE';
const base = require('./note-base');

// customize config
const config = {
    status: 'NOTE',
    longStatus: 'Group Note',
    styleSheet: 'W3C-NOTE',
};
exports.config = { ...base.config, ...config };

exports.rules = base.rules;
