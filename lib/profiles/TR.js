
// SotD
//  all dates DD Month YYYY (leading zero optional). (how?)
//  must link to group and include group name (how? maybe:)
//      This document was published by the <a href="http://www.w3.org/html/wg/">HTML Working Group</a> as
//      look for "prefix (.*) as", then check that $1 is in <a>?

exports.name = "Base";
exports.rules = [
    require("../rules/headers/title")
,   require("../rules/headers/div.head")
,   require("../rules/headers/hr")
,   require("../rules/headers/logo")
,   require("../rules/headers/h1-title")
,   require("../rules/headers/dl")
,   require("../rules/headers/h2-status")
,   require("../rules/headers/copyright")

,   require("../rules/style/sheet")

,   require("../rules/sotd/supersedable")
,   require("../rules/sotd/mailing-list")
,   require("../rules/sotd/pp")
,   require("../rules/sotd/stability")

,   require("../rules/structure/h2")
,   require("../rules/structure/section-ids")

,   require("../rules/links/internal")

,   require("../rules/validation/html")
,   require("../rules/validation/css")
];
