
// must validate links (we can easily do at least internal links)

//  must have last stylesheet be http://www.w3.org/StyleSheets/TR/{styleSheet} if styleSheet

// structure rules
//  first h2 after hr must be "Abstract"
//  first h2 after Abstract must be "Status of This Document"
//  first h2 after SotD must be "Table of Contents"

// section IDs
//  "Every marked-up section and subsection of the document MUST have a target anchor. A section is identified by a heading element (h1-h6). The anchor may be specified using an id (or name if an a element is used) attribute on any of the following: the heading element itself, the parent div or section element of the heading element (where the heading element is the first child of the div or section), a descendant of the heading element, or an a immediately preceding the heading element."

// SotD
//  turn that into a section, either with the container section|div or ranging to the next h2
//  must start with
//      <p><em>This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href="http://www.w3.org/TR/">W3C technical reports index</a> at http://www.w3.org/TR/.</em></p>
//  all dates DD Month YYYY (leading zero optional). validate this by grepping for month names.
//  must link to group and include group name (how?)
//  must link to mailing list, include its name, link to archive
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
];
