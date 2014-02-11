
// XXX not the right settings here
exports.name = "Team-Submission";
exports.config = {
    status:             "SUBM"
,   longStatus:         "First Public Working Draft"
,   previousVersion:    false
,   styleSheet:         "W3C-Team-SUBM"
,   stabilityWarning:   false
};
exports.rules = require("./TR").rules;
