
// XXX not the right settings here
exports.name = "Rec";
exports.config = {
    status:             "REC"
,   longStatus:         "Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-REC"
,   stabilityWarning:   "REC" // XXX different text
};
exports.rules = require("./TR").rules;
