
// Base profile for all Submissions

exports.name = "Submission";

var base = require("./base");
exports.rules = base.extendWithInserts({
    "headers.logo": require("../rules/headers/subm-logo")
});

// XXX after sotd.supersedable
//      Member SUBM inject text
//      Team SUBM link to all

// XXX Team SUBM mailing list for comments (checkable?)

