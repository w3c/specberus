
exports.name = "WD";
exports.config = {
    status:             "WD"
,   longStatus:         "Working Draft"
,   previousVersion:    true
,   styleSheet:         "W3C-WD"
,   stabilityWarning:   true // for all but Rec/Note
};
exports.rules = require("./base").rules;
