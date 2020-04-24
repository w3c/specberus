
exports.name = "FPWG-NOTE";
var wgnote = require("./WG-NOTE");
exports.config = wgnote.config;
exports.config.previousVersion = false;
console.log('fp-wg-note');
exports.rules = wgnote.rules;
