
exports.name = "FPCR";
exports.config = {
    status:             "CR"
,   longStatus:         "First Public Working Draft and Candidate Recommendation"
,   previousVersion:    false
,   styleSheet:         "W3C-CR"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var base = require("./base");
exports.rules = base.insertAfter(
        require("./TR").rules
    ,   "sotd.status"
    ,   [
            require("../rules/sotd/cr-end")
        ,   require("../rules/sotd/implementation")
        ]
);

