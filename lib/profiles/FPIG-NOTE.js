
exports.name = "FP IG Note";
var ignote = require("./IG-NOTE");
exports.config = ignote.config;
exports.config.previousVersion = false;
exports.rules = ignote.rules;
