
exports.name = "FP WG Note";
var wgnote = require("./WG-NOTE");
exports.config = wgnote.config;
exports.config.previousVersion = false;
exports.rules = wgnote.rules;
