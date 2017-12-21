
exports.name = "WG-NOTE";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Working Group Note"
,   previousVersion:    false
,   styleSheet:         "W3C-WG-NOTE"
,   stabilityWarning:   true
,   noteStatus:         true
};

const base = require("../base");

exports.rules = base.extendWithInserts({
    "sotd.supersedable":    [
                              require("../../rules/sotd/diff")
                            , require("../../rules/sotd/deliverer-note")
                            ]
});
