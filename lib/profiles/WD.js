
// must have last stylesheet be http://www.w3.org/StyleSheets/TR/W3C-WD

// stability (all but Rec/Note)
// <p>Publication as a Working Draft does not imply endorsement by the W3C Membership. This is a draft document and may be updated, replaced or obsoleted by other documents at any time. It is inappropriate to cite this document as other than work in progress.</p>

exports.name = "WD";
exports.config = {
    status:             "WD"
,   longStatus:         "Working Draft"
,   previousVersion:    true
,   styleSheet:         "W3C-WD" // XXX for style checker
,   stabilityWarning:   true // XXX for sotd checker
};
exports.rules = require("./base").rules;
