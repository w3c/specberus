
exports.name = "FPWD";
exports.config = {
    status:             "WD"
,   longStatus:         "First Public Working Draft"
,   previousVersion:    false
,   styleSheet:         "W3C-WD"
,   stabilityWarning:   true
,   sotdStatus:         true
};
exports.rules = require("./TR").rules;
