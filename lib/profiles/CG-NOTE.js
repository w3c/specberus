
exports.name = "CG-NOTE";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Coordination Group Note"
,   previousVersion:    false
,   styleSheet:         "W3C-CG-NOTE"
,   stabilityWarning:   true
,   noteStatus:         true
};

var base = require("./base");
exports.rules = base.insertAfter(
                        require("./tr").rules
                    ,   "sotd.pp"
                    ,   require("../rules/sotd/charter-disclosure")
);
