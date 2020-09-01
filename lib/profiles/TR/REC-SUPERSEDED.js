
exports.name = "REC-SUPERSEDED";
exports.config = {
    status:             "SPSD"
,   longStatus:         "Superseded Recommendation"
,   previousVersion:    false
,   supersedes:         true
,   styleSheet:         "W3C-SPSD"
,   stabilityWarning:   false
,   recTrackStatus:     true
};

var base = require("../base")
,   rules = base.insertAfter(
                        require("../TR").rules
                    ,   "headers.dl"
                    ,   [
                            require("../../rules/headers/errata")
                        ]
);

rules = base.insertAfter(
        rules
    ,   "sotd.supersedable"
    ,   [
            require("../../rules/sotd/diff")
        ,   require("../../rules/sotd/obsl-rescind")
        ]
    )
;

exports.rules = rules;
