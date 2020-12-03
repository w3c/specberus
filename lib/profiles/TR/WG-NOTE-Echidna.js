
exports.name = "WG-NOTE-Echidna";
exports.config = require("./WG-NOTE").config;

var base = require("../base");
exports.rules = base.insertAfter(
        require("./WG-NOTE").rules
    ,   "sotd.status"
    ,   [
            require("../../rules/echidna/todays-date.js")
        ]
);
