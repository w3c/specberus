exports.name = 'FP-NOTE';
const note = require('./NOTE');

const config = { ...note.config };
config.previousVersion = false;
exports.config = config;

// First Public document doesn't need to check 'diff'
const base = require('../base');

const rules = base.removeRules(note.rules, 'sotd.diff');
exports.rules = rules;
