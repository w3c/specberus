
exports.name = "IG-NOTE";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Interest Group Note"
,   previousVersion:    false
,   styleSheet:         "W3C-IG-NOTE"
,   stabilityWarning:   true
,   noteStatus:         true
};

var base = require("../base")
,   rules = base.insertAfter(
                        require("../TR").rules
                    ,   "sotd.pp"
                    ,   [
                          require("../../rules/sotd/pp-note")
                        , require("../../rules/sotd/charter-disclosure")
                        ]
);

rules = base.insertAfter(
        rules
    ,   "sotd.supersedable"
    ,   [require("../../rules/sotd/diff")]
    )
;

exports.rules = rules;
