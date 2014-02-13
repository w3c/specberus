
exports.name = "CR";
exports.config = {
    status:             "CR"
,   longStatus:         "Candidate Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-CR"
,   stabilityWarning:   true
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./TR").rules
                    ,   "sotd.status"
                    ,   require("../rules/sotd/cr-end")
);
