
// XXX not the right settings here
exports.name = "Rescinded";
exports.config = {
    status:             "RSCND"
,   longStatus:         "First Public Working Draft"
,   previousVersion:    false
,   styleSheet:         "W3C-RSCND"
,   stabilityWarning:   false
};
exports.rules = require("./TR").rules;
