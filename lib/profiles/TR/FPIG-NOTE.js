exports.name = 'FPIG-NOTE';
const ignote = require('./IG-NOTE');

const config = { ...ignote.config };
config.previousVersion = false;
exports.config = config;

// First Public document doesn't need to check 'diff'
const base = require('../base');

const rules = base.removeRules(ignote.rules, 'sotd.diff');
exports.rules = rules;
