
exports.name = "WG-NOTE";
exports.config = {
    status:             "NOTE"
,   longStatus:         "Working Group Note"
,   previousVersion:    true
,   styleSheet:         "W3C-WG-NOTE"
,   stabilityWarning:   true
,   noteStatus:         true
};

const base = require("../base");

const rules = base.extendWithInserts({
    "headers.h2-status":    [
                                require("../../rules/headers/mailing-list")
                            ,   require("../../rules/headers/copyright")
                            ]
,   "sotd.supersedable":    [
                              require("../../rules/sotd/diff")
                            , require("../../rules/sotd/deliverer-note")
                            , require("../../rules/sotd/group-homepage")
                            , require("../../rules/sotd/stability")
                            , require("../../rules/sotd/status")
                            , require("../../rules/sotd/pp")
                            , require("../../rules/sotd/process-document")
                            ]
});

exports.rules = base.removeRules(rules, "sotd.draft-stability");
