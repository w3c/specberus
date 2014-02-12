
exports.name = "Team Submission";
exports.config = {
    status:             "SUBM"
,   longStatus:         "Team Submission"
,   previousVersion:    false
,   styleSheet:         "W3C-Team-SUBM"
,   stabilityWarning:   true
,   submissionType:     "team"
};

var base = require("./base")
,   rules = base.insertAfter(
                        require("./SUBM").rules
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
