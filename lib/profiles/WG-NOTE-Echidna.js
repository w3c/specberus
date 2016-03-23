
exports.name = "WG Note-Echidna";
exports.config = require("./WG-NOTE").config;

var base = require("./base");
exports.rules = base.insertAfter(
        require("./WD").rules
    ,   "sotd.status"
    ,   [
            require("../rules/echidna/editor-ids.js")
        ,   require("../rules/echidna/todays-date.js")
        ]
);
