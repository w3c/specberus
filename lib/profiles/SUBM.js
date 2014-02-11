
// Base profile for all Submissions

exports.name = "Submission";

var base = require("./base");
exports.rules = base.extendWithInserts({
});

// XXX after headers.logo
//  // SUBM: check logo here
// in headers.dl
//  //  subm variants in syntax

    // XXX applies to all TR *AND* Team Subm
    //  but Member SUBM has different rule
// ,   require("../rules/headers/copyright")

// XXX after sotd.supersedable
// XXX Member SUBM inject text
// XXX Team SUBM link to all

// not all these are checkable, put them in a someday list
// XXX Team SUBM mailing list for comments

