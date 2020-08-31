
exports.name = "CRD";
exports.config = {
    status:             "CRD"
,   longStatus:         "Candidate Recommendation"
,   crType:             "Draft"
,   previousVersion:    true
,   styleSheet:         "W3C-CRS"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var base = require("../base")
,   rules = base.removeRules(
    require("./CR").rules,
    "sotd.cr-end"
);

rules = base.insertAfter(
    rules
    ,   "sotd.status"
    ,   [
            require("../../rules/sotd/cr-stability")
        ]
);
exports.rules = rules;
