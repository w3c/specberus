
exports.name = "PR";
exports.config = {
    status:             "PR"
,   longStatus:         "Proposed Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-PR"
,   stabilityWarning:   true
};
exports.rules = require("./TR").rules;
