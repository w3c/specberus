
// base profile for all things TR
exports.name = "TR";

var base = require("./base");
exports.rules = base.extendWithInserts({
    "headers.h2-status":    [
                                require("../rules/headers/mailing-list")
                            ,   require("../rules/headers/copyright")
                            ]
,   "sotd.supersedable":    [
                                require("../rules/sotd/group-homepage")
                            ,   require("../rules/sotd/stability")
                            ,   require("../rules/sotd/draft-stability")
                            ,   require("../rules/sotd/status")
                            ,   require("../rules/sotd/pp")
                            ,   require("../rules/sotd/process-document")
                            ]
});
