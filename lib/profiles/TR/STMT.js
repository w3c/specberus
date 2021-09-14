exports.name = 'STMT';
const note = require('./NOTE');
const base = require('../base');

const config = { ...note.config };
config.longStatus = 'Statement';
exports.config = config;

exports.rules = base.removeRules(note.rules, 'sotd.note-not-endorsed');
