
exports.name = "PR";
exports.config = {
    status:             "PR"
,   longStatus:         "Proposed Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-PR"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var base = require("./base");
exports.rules = base.insertAfter(
        require("./TR").rules
    ,   "sotd.processDocument"
    ,   [
            require("../rules/sotd/implementation")
        ,   require("../rules/sotd/review-end")
        ]
);

