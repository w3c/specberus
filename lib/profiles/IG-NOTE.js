
exports.name = "IG Note";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Interest Group Note"
,   processDocument:            true
,   previousVersion:    false
,   styleSheet:         "W3C-IG-NOTE"
,   stabilityWarning:   true
,   noteStatus:         true
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./TR").rules
                    ,   "sotd.pp"
                    ,   require("../rules/sotd/charter-disclosure")
);
