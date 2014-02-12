
// XXX not the right settings here
exports.name = "Team Submission";
exports.config = {
    status:             "SUBM"
,   longStatus:         "First Public Working Draft"
,   previousVersion:    false
,   styleSheet:         "W3C-Team-SUBM"
,   stabilityWarning:   false
,   submissionType:     "team"
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./SUBM").rules
                    ,   "headers.h2-status"
                    ,   [
                            require("../rules/headers/copyright")
                        ]
);

