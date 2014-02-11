
exports.name = "WG Note";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Working Group Note"
,   previousVersion:    true
,   styleSheet:         "W3C-WG-NOTE"
,   stabilityWarning:   false
};
exports.rules = require("./TR").rules;
