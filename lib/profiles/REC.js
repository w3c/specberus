
exports.name = "Rec";
exports.config = {
    status:             "REC"
,   longStatus:         "Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-REC"
,   stabilityWarning:   "REC" // XXX different text
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./TR").rules
                    ,   "headers.dl"
                    ,   require("../rules/headers/errata")
);
