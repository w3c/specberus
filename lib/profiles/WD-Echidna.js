
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

var wd = require("./WD");
exports.rules = wd.insertAfter(
        require("./TR").rules
    ,   "sotd.status"
    ,   [
            require("../echidna/editor-ids.js")
        ]
);

