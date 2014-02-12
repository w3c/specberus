
// XXX not the right settings here
exports.name = "Member-Submission";
exports.config = {
    status:             "SUBM"
,   longStatus:         "First Public Working Draft"
,   previousVersion:    false
,   styleSheet:         "W3C-Member-SUBM"
,   stabilityWarning:   false
,   submissionType:     "member"
};
exports.rules = require("./TR").rules;
