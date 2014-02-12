
exports.name = "LC";
exports.config = {
    status:             "WD"
,   longStatus:         "Last Call Working Draft"
,   previousVersion:    true
,   styleSheet:         "W3C-WD"
,   stabilityWarning:   true
,   sotdStatus:         true
};
exports.rules = require("./TR").rules;
