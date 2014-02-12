
// Base profile for all Submissions

exports.name = "Submission";

var base = require("./base");
exports.rules = base.extendWithInserts({
    "headers.logo": require("../rules/headers/subm-logo")
});

// XXX in headers.dl
//  //  subm variants in syntax

    // XXX applies to all TR *AND* Team Subm
    //  but Member SUBM has different rule
// ,   require("../rules/headers/copyright")

// XXX after sotd.supersedable
// XXX Member SUBM inject text
// XXX Team SUBM link to all

// XXX Team SUBM mailing list for comments (checkable?)

