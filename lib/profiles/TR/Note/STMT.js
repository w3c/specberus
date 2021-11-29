exports.name = 'STMT';
const base = require('./note-base');

// customize config
const config = {
    status: 'STMT',
    longStatus: 'Statement',
    styleSheet: 'W3C-STMT',
};
exports.config = { ...base.config, ...config };

exports.rules = base.rules;
