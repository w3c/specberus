
exports.name = "CG-NOTE";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Coordination Group Note"
,   previousVersion:    true
,   styleSheet:         "W3C-CG-NOTE"
,   stabilityWarning:   false
};
exports.rules = require("./TR").rules;
