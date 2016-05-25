
exports.name = "REC";
exports.config = {
    status:             "REC"
,   longStatus:         "Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-REC"
,   stabilityWarning:   "REC"
,   recTrackStatus:     true
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./TR").rules
                    ,   "headers.dl"
                    ,   [
                            require("../rules/headers/errata")
                        ,   require("../rules/headers/translations")
                        ,   require("../rules/sotd/implementation")
                        ]
);
