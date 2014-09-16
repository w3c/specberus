
exports.name = "Rescinded";
exports.config = {
    status:             "RSCND"
,   longStatus:         "Rescinded Recommendation"
,   processDocument:            true
,   previousVersion:    false
,   styleSheet:         "W3C-RSCND"
,   stabilityWarning:   false
,   rescinds:           true
};
exports.rules = require("./TR").rules;
