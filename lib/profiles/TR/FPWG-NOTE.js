exports.name = 'FPWG-NOTE';
const wgnote = require('./WG-NOTE');

const config = { ...wgnote.config };
config.previousVersion = false;
exports.config = config;

// First Public document doesn't need to check 'diff'
const base = require('../base');

const rules = base.removeRules(wgnote.rules, 'sotd.diff');
exports.rules = rules;
