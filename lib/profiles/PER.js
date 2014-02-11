
exports.name = "PER";
exports.config = {
    status:             "PER"
,   longStatus:         "Proposed Edited Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-PER"
,   stabilityWarning:   true
};
exports.rules = require("./TR").rules;
