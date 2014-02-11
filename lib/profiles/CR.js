
exports.name = "CR";
exports.config = {
    status:             "CR"
,   longStatus:         "Candidate Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-CR"
,   stabilityWarning:   true
};
exports.rules = require("./TR").rules;
