
exports.name = "RSCND";
exports.config = {
    status:             "RSCND"
,   longStatus:         "Rescinded Recommendation"
,   previousVersion:    false
,   styleSheet:         "W3C-RSCND"
,   stabilityWarning:   false
,   rescinds:           true
};
exports.rules = require("./TR").rules;
