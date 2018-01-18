
exports.name = "REC-AMENDED";
exports.config = {
    status:             "REC"
,   longStatus:         "Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-REC"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var base = require("../base")
,   REC = require("./REC")
,   rules = base.removeRules(REC.rules, "sotd.pp")
;

exports.rules = rules;
