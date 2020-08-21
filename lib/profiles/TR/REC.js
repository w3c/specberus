
exports.name = "REC";
exports.config = {
    status:             "REC"
,   longStatus:         "Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-REC"
,   stabilityWarning:   "REC"
,   recTrackStatus:     true
};

var base = require("../base")
,   rules = base.insertAfter(
                        require("../TR").rules
                    ,   "headers.dl"
                    ,   [
                            require("../../rules/headers/errata")
                        ,   require("../../rules/sotd/implementation")
                        ]
);
rules = base.insertAfter(
        rules
    ,   "sotd.supersedable"
    ,   [
            require("../../rules/sotd/diff")
        ,   require("../../rules/sotd/rec-addition")
        ]
    )
;

exports.rules = rules;
