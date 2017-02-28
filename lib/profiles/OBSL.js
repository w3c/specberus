
exports.name = "OBSL";
exports.config = {
    status:             "OBSL"
,   longStatus:         "Obsolete Recommendation"
,   previousVersion:    false
,   styleSheet:         "W3C-OBSL"
,   stabilityWarning:   false
,   recTrackStatus:     true
,   obsoletes:          true
};

var base = require("./base")
,   rules = base.insertAfter(
                        require("./TR").rules
                    ,   "headers.dl"
                    ,   [
                            require("../rules/headers/errata")
                        ,   require("../rules/headers/translations")
                        ,   require("../rules/sotd/implementation")
                        ]
);

rules = base.insertAfter(
        rules
    ,   "sotd.supersedable"
    ,   [
            require("../rules/sotd/diff")
        ,   require("../rules/sotd/obsl-rescind")
        ]
    )
;

exports.rules = rules;
