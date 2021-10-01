exports.name = 'STMT';
const note = require('./NOTE');

const config = { ...note.config };
config.longStatus = 'Statement';
config.styleSheet = 'W3C-STMT';
exports.config = config;

exports.rules = note.rules;
