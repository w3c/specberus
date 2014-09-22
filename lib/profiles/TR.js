
// base profile for all things TR
exports.name = "TR";

var base = require("./base");
exports.rules = base.extendWithInserts({
    "headers.h2-status":    require("../rules/headers/copyright")
,   "sotd.supersedable":    [
                                require("../rules/sotd/mailing-list")
                            // ,   require("../rules/sotd/group-name")
                            ,   require("../rules/sotd/stability")
                            ,   require("../rules/sotd/status")
                            ,   require("../rules/sotd/process")
                            ]
});
