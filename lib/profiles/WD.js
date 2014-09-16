
// Working Draft profile

exports.name = "WD";
exports.config = {
    status:             "WD"
,   longStatus:         "Working Draft"
,   processDocument:            true
,   previousVersion:    true
,   styleSheet:         "W3C-WD"
,   stabilityWarning:   true
,   recTrackStatus:     true
};
exports.rules = require("./TR").rules;
