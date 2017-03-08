
exports.name = "CR";
exports.config = {
    status:             "CR"
,   longStatus:         "Candidate Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-CR"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var base = require("./base")
,   rules = base.insertAfter(
        require("./tr").rules
    ,   "sotd.status"
    ,   [
            require("../rules/sotd/cr-end")
        ,   require("../rules/sotd/implementation")
        ]
);
rules = base.insertAfter(
        rules
    ,   "sotd.supersedable"
    ,   [require("../rules/sotd/diff")
    ,    require("../rules/structure/security-privacy")]
    )
;

exports.rules = rules;
