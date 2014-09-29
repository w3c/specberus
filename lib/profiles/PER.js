
exports.name = "PER";
exports.config = {
    status:             "PER"
,   longStatus:         "Proposed Edited Recommendation"
,   previousVersion:    true
,   styleSheet:         "W3C-PER"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var base = require("./base");
exports.rules = base.insertAfter(
        require("./TR").rules
    ,   "sotd.processDocument"
    ,   require("../rules/sotd/implementation")
);

