
exports.name = "PR-AMENDED";
exports.config = {
    status:             "PR"
,   longStatus:         "Proposed Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-PR"
,   stabilityWarning:   true
,   recTrackStatus:     true
,   amended:            true
};

var base = require("../base")
,   PR = require("./PR")
,   rules = base.removeRules(PR.rules, "sotd.pp")
;

exports.rules = rules;
