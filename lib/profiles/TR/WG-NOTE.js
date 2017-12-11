
exports.name = "WG-NOTE";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Working Group Note"
,   previousVersion:    false
,   styleSheet:         "W3C-WG-NOTE"
,   stabilityWarning:   true
,   noteStatus:         true
};

const base = require("../base")
,   rules = base.insertAfter(
        require("../TR").rules
    ,   "sotd.supersedable"
    ,   [require("../../rules/sotd/diff")]
    )
;

exports.rules = base.extendWithInserts({
    "sotd.supersedable":    [
                              require("../../rules/sotd/diff")
                            , require("../../rules/sotd/deliverer-note")
                            ]
});

exports.rules = rules;
