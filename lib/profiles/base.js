
// SotD
//  all dates DD Month YYYY (leading zero optional). (how?)
//  must link to group and include group name (how? maybe:)
//      This document was published by the <a href="http://www.w3.org/html/wg/">HTML Working Group</a> as
//      look for "prefix (.*) as", then check that $1 is in <a>?

// PP
//  <p> This document was produced by a group operating under the <a href="http://www.w3.org/Consortium/Patent-Policy-20040205/">5 February 2004 W3C Patent Policy</a>. W3C maintains a <a rel="disclosure" href="@@URI to IPP status or other page@@">public list of any patent disclosures</a> made in connection with the deliverables of the group; that page also includes instructions for disclosing a patent. An individual who has actual knowledge of a patent which the individual believes contains <a href="http://www.w3.org/Consortium/Patent-Policy-20040205/#def-essential">Essential Claim(s)</a> must disclose the information in accordance with <a href="http://www.w3.org/Consortium/Patent-Policy-20040205/#sec-Disclosure">section 6 of the W3C Patent Policy</a>. </p>

exports.name = "Base";
exports.rules = [
    require("../rules/validation/html")
,   require("../rules/validation/css")

,   require("../rules/headers/title")
,   require("../rules/headers/div.head")
,   require("../rules/headers/hr")
,   require("../rules/headers/logo")
,   require("../rules/headers/h1-title")
,   require("../rules/headers/dl")
,   require("../rules/headers/h2-status")
,   require("../rules/headers/copyright")

,   require("../rules/style/sheet")

,   require("../rules/links/internal")

,   require("../rules/structure/h2")
,   require("../rules/structure/section-ids")

,   require("../rules/sotd/supersedable")
,   require("../rules/sotd/mailing-list")
];
