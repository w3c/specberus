
exports.name = "CR";
exports.config = {
    status:             "CR"
,   longStatus:         "Candidate Recommendation"
,   crType:             "Snapshot"
,   previousVersion:    true
,   styleSheet:         "W3C-CR"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var base = require("../base")
,   rules = base.insertAfter(
        require("../TR").rules
    ,   "sotd.status"
    ,   [
            require("../../rules/sotd/cr-end")
        ,   require("../../rules/sotd/publish")
        ]
);
rules = base.insertAfter(
        rules
    ,   "sotd.supersedable"
    ,   [require("../../rules/sotd/diff")
    ,    require("../../rules/structure/security-privacy")]
    )
;
rules = base.insertAfter(
        rules
    ,   "headers.h2-status"
    ,   [
        require("../../rules/headers/h3-cr-type")
    ]
    )
;

exports.rules = rules;
