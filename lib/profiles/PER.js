
exports.name = "PER";
exports.config = {
    status:             "PER"
,   longStatus:         "Proposed Edited Recommendation"
,   processDocument:            true
,   previousVersion:    true
,   styleSheet:         "W3C-PER"
,   stabilityWarning:   true
,   recTrackStatus:     true
};
exports.rules = require("./TR").rules;
