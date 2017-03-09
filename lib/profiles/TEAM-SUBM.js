
exports.name = "TEAM-SUBM";
exports.config = {
    status:             "TEAM-SUBM"
,   longStatus:         "Team Submission"
,   previousVersion:    false
,   styleSheet:         "W3C-Team-SUBM"
,   stabilityWarning:   false
,   submissionType:     "team"
};

var base = require("./base")
,   rules = base.insertAfter(
                        require("./subm").rules
                    ,   "headers.h2-status"
                    ,   [
                            require("../rules/headers/copyright")
                        ]
);
rules = base.insertAfter(
                        rules
                    ,   "sotd.supersedable"
                    ,   require("../rules/sotd/team-subm-link")
);
exports.rules = rules;
