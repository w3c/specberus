
exports.name = "IG-NOTE-Echidna";
exports.config = require("./IG-NOTE").config;

var base = require("../base");
exports.rules = base.insertAfter(
        require("./IG-NOTE").rules
    ,   "sotd.status"
    ,   [
            require("../../rules/echidna/editor-ids.js")
        ,   require("../../rules/echidna/todays-date.js")
        ]
);
