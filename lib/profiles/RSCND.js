
exports.name = "RSCND";
exports.config = {
    status:             "RSCND"
,   longStatus:         "Rescinded Recommendation"
,   previousVersion:    false
,   styleSheet:         "W3C-RSCND"
,   stabilityWarning:   false
,   rescinds:           true
};

var base = require("./base");
exports.rules = base.extendWithInserts({
    "headers.h2-status":    require("../rules/headers/copyright")
,   "sotd.supersedable":    [
                                require("../rules/sotd/mailing-list")
                            ,   require("../rules/sotd/group-homepage")
                            ,   require("../rules/sotd/stability")
                            ,   require("../rules/sotd/obsl-rescind")
                            ,   require("../rules/sotd/status")
                            ,   require("../rules/sotd/process-document")
                            ]
});
