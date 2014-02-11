
// XXX not the right settings here
exports.name = "FPWD";
exports.config = {
    status:             "WD"
,   longStatus:         "First Public Working Draft"
,   previousVersion:    false
,   styleSheet:         "W3C-RSCND"
,   stabilityWarning:   true
};
exports.rules = require("./TR").rules;
