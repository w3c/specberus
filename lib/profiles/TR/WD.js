
// Working Draft profile

exports.name = "WD";
exports.config = {
    status:             "WD"
,   longStatus:         "Working Draft"
,   previousVersion:    true
,   styleSheet:         "W3C-WD"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

const base = require("../base")
,   rules = base.insertAfter(
        require("../TR").rules
    ,   "sotd.supersedable"
    ,   [require("../../rules/sotd/diff")
    ,    require("../../rules/structure/security-privacy")]
    )
;

exports.rules = rules;
