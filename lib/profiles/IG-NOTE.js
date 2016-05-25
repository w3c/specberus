
exports.name = "IG-NOTE";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Interest Group Note"
,   previousVersion:    false
,   styleSheet:         "W3C-IG-NOTE"
,   stabilityWarning:   true
,   noteStatus:         true
};

var base = require("./base")
,   rules = base.insertAfter(
                        require("./TR").rules
                    ,   "sotd.pp"
                    ,   require("../rules/sotd/charter-disclosure")
)
,   index = rules.map(function (r) { return r.name; }).indexOf("sotd.pp");
// No patent policy for IG Notes
rules.splice(index, 1);

exports.rules = rules;
