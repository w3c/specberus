
exports.name = "CG-NOTE";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Coordination Group Note"
,   processDocument:            true
,   previousVersion:    false
,   styleSheet:         "W3C-CG-NOTE"
,   stabilityWarning:   true
,   noteStatus:         true
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./TR").rules
                    ,   "sotd.pp"
                    ,   require("../rules/sotd/charter-disclosure")
);
