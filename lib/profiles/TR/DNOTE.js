exports.name = 'DNOTE';
const note = require('./NOTE');

const config = { ...note.config };
config.longStatus = 'Group Draft Note';
config.styleSheet = 'W3C-DNOTE';

exports.config = config;

exports.rules = note.rules;
