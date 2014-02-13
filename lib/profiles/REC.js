
exports.name = "Rec";
exports.config = {
    status:             "REC"
,   longStatus:         "Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-REC"
,   stabilityWarning:   "REC"
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./TR").rules
                    ,   "headers.dl"
                    ,   [
                            require("../rules/headers/errata")
                        ,   require("../rules/headers/translations")
                        ]
);
