
exports.name = "FPWG-NOTE";
var wgnote = require("./WG-NOTE");
var config = Object.assign({}, wgnote.config);
config.previousVersion = false;
exports.config = config;
exports.rules = wgnote.rules;
