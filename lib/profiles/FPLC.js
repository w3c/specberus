
exports.name = "FPLC";
exports.config = {
    status:             "WD"
,   longStatus:         "First Public and Last Call Working Draft"
,   previousVersion:    false
,   styleSheet:         "W3C-WD"
,   stabilityWarning:   true
,   sotdStatus:         true
,   recTrackStatus:     true
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./TR").rules
                    ,   "sotd.status"
                    ,   require("../rules/sotd/review-end")
);
