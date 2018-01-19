
exports.name = "CR-AMENDED";
exports.config = {
    status:             "CR"
,   longStatus:         "Candidate Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-CR"
,   stabilityWarning:   true
,   recTrackStatus:     true
,   amended:            true
};

exports.rules = require("./CR").rules;
