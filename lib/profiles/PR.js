
exports.name = "PR";
exports.config = {
    status:             "PR"
,   longStatus:         "Proposed Recommendation"
,   processDocument:            true
,   previousVersion:    true
,   styleSheet:         "W3C-PR"
,   stabilityWarning:   true
,   recTrackStatus:     true
};
exports.rules = require("./TR").rules;
