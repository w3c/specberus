
exports.name = "CR-AMENDED";
exports.config = {
    status:             "CR"
,   longStatus:         "Candidate Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-CR"
,   stabilityWarning:   true
,   recTrackStatus:     true
,   amended:            true
};

var base = require("../base")
,   CR = require("./CR")
,   rules = base.removeRules(CR.rules, "sotd.pp")
;

exports.rules = rules;
