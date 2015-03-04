
// Working Draft profile

exports.name = "WD-Echidna";
exports.config = {
    status:             "WD"
,   longStatus:         "Working Draft"
,   previousVersion:    true
,   styleSheet:         "W3C-WD"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var base = require("./base");
exports.rules = base.insertAfter(
        require("./WD").rules
    ,   "sotd.status"
    ,   [
            require("../rules/echidna/editor-ids.js")
        ,   require("../rules/echidna/todays-date.js")
        ]
);

