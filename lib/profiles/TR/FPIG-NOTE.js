
exports.name = "FPIG-NOTE";
var ignote = require("./IG-NOTE");
var config = Object.assign({}, ignote.config);
config.previousVersion = false;
exports.config = config;
exports.rules = ignote.rules;
