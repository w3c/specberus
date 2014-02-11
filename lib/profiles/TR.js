
// base profile for all things TR

// XXX
// SotD
//  all dates DD Month YYYY (leading zero optional). (how?)
//  must link to group and include group name (how? maybe:)
//      This document was published by the <a href="http://www.w3.org/html/wg/">HTML Working Group</a> as
//      look for "prefix (.*) as", then check that $1 is in <a>?

exports.name = "TR";

var base = require("./base");
exports.rules = base.extendWithInserts({
    "headers.h2-status":    require("../rules/headers/copyright")
,   "sotd.supersedable":    require("../rules/sotd/mailing-list")
});

// after sotd.supersedable:
//  not all these are checkable, put them in a someday list
//  XXX PER|PR link to AC review
//  XXX LC end of review
//  XXX PR PER end of AC review
//  XXX CR minimal duration (+ estimate of implementation experience) (+ preliminary implementation report)
//  XXX PR PER REC link to implementation report
//  XXX CR features at risk if any
//  XXX REC RSCND link to previous rec

// also after sotd.supersedable
    // USE AN OPTION FOR THIS
    // XXX only: WD (variants), CR, PR, PER, REC, WG-NOTE (variants)
    //  but: specific text variant if not going to Rec or informative only (not sure how determined)
    //  but: remove "An individual..." for REC
// ,   require("../rules/sotd/pp")
    // XXX FPIG-NOTE, IG-NOTE, CG-NOTE has different text

    // WE HAVE AN OPTION!
    // XXX only for WD (variants), CR, PR, PER, NOTE
// ,   require("../rules/sotd/stability")
    // XXX other text for REC

// after header.dl
//  // XXX right after this REC adds errata

// in headers.h2-status
//  new editions or edited in place have a variant -- REC only


