
// base profile for all things TR

// XXX not sure how to check the requirements below (going after sotd.supersedable)
// SotD
//  all dates DD Month YYYY (leading zero optional). (how?)
//  must link to group and include group name (how?) maybe:
//      This document was published by the <a href="http://www.w3.org/html/wg/">HTML Working Group</a> as
//      look for "prefix (.*) as", then check that $1 is in <a>?
//      or use http://www.w3.org/2000/04/mem-news/public-groups.rdf
// PER|PR SotD link to AC review
// CR SotD list features at risk if any
// PR PER REC SotD link to implementation report

exports.name = "TR";

var base = require("./base");
exports.rules = base.extendWithInserts({
    "headers.h2-status":    require("../rules/headers/copyright")
,   "sotd.supersedable":    [
                                require("../rules/sotd/mailing-list")
                            ,   require("../rules/sotd/stability")
                            ,   require("../rules/sotd/status")
                            ]
});

// also after sotd.supersedable
    //  XXX LC end of review
    //  XXX PR PER end of AC review
    //  XXX CR minimal duration (+ estimate of implementation experience) (+ preliminary implementation report)

    // USE AN OPTION FOR THIS
    // XXX only: WD (variants), CR, PR, PER, REC, WG-NOTE (variants)
    //  but: specific text variant if not going to Rec or informative only (not sure how determined)
    //  but: remove "An individual..." for REC
// ,   require("../rules/sotd/pp")
    // XXX FPIG-NOTE, IG-NOTE, CG-NOTE has different text

// after header.dl
//  // XXX right after this REC adds errata

// in headers.h2-status
//  new editions or edited in place have a variant -- REC only


