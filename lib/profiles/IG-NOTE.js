
exports.name = "IG Note";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Interest Group Note"
,   previousVersion:    true
,   styleSheet:         "W3C-IG-NOTE"
,   stabilityWarning:   true
};
exports.rules = require("./TR").rules;
