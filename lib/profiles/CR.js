
exports.name = "CR";
exports.config = {
    status:             "CR"
,   longStatus:         "Candidate Recommendation"
,   processDocument:            true
,   previousVersion:    true
,   styleSheet:         "W3C-CR"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./TR").rules
                    ,   "sotd.status"
                    ,   require("../rules/sotd/cr-end")
);
