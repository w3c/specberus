
exports.name = "FPIG-NOTE";
var ignote = require("./IG-NOTE");
var config = Object.assign({}, ignote.config);
config.previousVersion = false;
exports.config = config;

// First Public document doesn't need to check 'diff'
var base = require("../base");
var rules = base.removeRules(ignote.rules, "sotd.diff");
exports.rules = rules;
