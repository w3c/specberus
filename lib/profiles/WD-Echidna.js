
// Working Draft profile

exports.name = "WD-Echidna";
exports.config = require("./WD").config;

var base = require("./base");
exports.rules = base.insertAfter(
        require("./WD").rules
    ,   "sotd.status"
    ,   [
            require("../rules/echidna/editor-ids.js")
        ,   require("../rules/echidna/todays-date.js")
        ]
);

