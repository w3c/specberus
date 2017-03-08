
exports.name = "PR";
exports.config = {
    status:             "PR"
,   longStatus:         "Proposed Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-PR"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var base = require("./base")
,   rules = base.insertAfter(
        require("./tr").rules
    ,   "sotd.process-document"
    ,   [
            require("../rules/sotd/implementation")
        ,   require("../rules/sotd/ac-review")
        ,   require("../rules/sotd/review-end")
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
