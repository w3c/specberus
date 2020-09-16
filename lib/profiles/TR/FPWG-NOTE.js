
exports.name = "FPWG-NOTE";
var wgnote = require("./WG-NOTE");
var config = Object.assign({}, wgnote.config);
config.previousVersion = false;
exports.config = config;

// First Public document doesn't need to check 'diff'
var base = require("../base");
var rules = base.removeRules(wgnote.rules, "sotd.diff");
exports.rules = rules;
