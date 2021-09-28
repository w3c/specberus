exports.name = 'STMT';
const note = require('./NOTE');

const config = { ...note.config };
config.longStatus = 'Statement';
exports.config = config;

exports.rules = note.rules;
