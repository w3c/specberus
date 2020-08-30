
exports.name = "CR";
exports.config = {
    status:             "CRD"
,   longStatus:         "Candidate Recommendation"
,   crType:             "Draft"
,   previousVersion:    true
,   styleSheet:         "W3C-CRS"
,   stabilityWarning:   true
,   recTrackStatus:     true
};

var rules = require("./CR").rules

// ,   rules = base.insertAfter(
//         require("../TR").rules
//     ,   "sotd.status"
//     ,   [
//             require("../../rules/sotd/cr-end")
//         ,   require("../../rules/sotd/implementation")
//         ]
// );
// rules = base.insertAfter(
//         rules
//     ,   "sotd.supersedable"
//     ,   [require("../../rules/sotd/diff")
//     ,    require("../../rules/structure/security-privacy")]
//     )
    ;

exports.rules = rules;