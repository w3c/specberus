
exports.name = "LC";
exports.config = {
    status:             "WD"
,   longStatus:         "Last Call Working Draft"
,   processDocument:            true
,   previousVersion:    true
,   styleSheet:         "W3C-WD"
,   stabilityWarning:   true
,   sotdStatus:         true
,   recTrackStatus:     true
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./TR").rules
                    ,   "sotd.status"
                    ,   require("../rules/sotd/lc-end")
);
