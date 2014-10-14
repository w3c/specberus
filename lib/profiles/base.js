
// Base profile for all W3C published documents
exports.name = "Base";

// take an array of rules, return a copy with new rules added after a given named anchor
exports.insertAfter = function (original, anchor, rules) {
    rules = Array.isArray(rules) ? rules : [rules];
    original = original.slice();
    var index = original.map(function (r) { return r.name; }).indexOf(anchor);
    if (index < 0) return original.concat(rules);
    else {
        rules.forEach(function (r) {
            original.splice(index, 0, r);
            index++;
        });
        return original;
    }
};
// same as above but all at once with an object and defaulting to our rules
exports.extendWithInserts = function (inserts) {
    var rules = exports.rules.slice();
    for (var anchor in inserts) rules = exports.insertAfter(rules, anchor, inserts[anchor]);
    return rules;
};

exports.rules = [
    require("../rules/headers/title")
,   require("../rules/headers/div.head")
,   require("../rules/headers/hr")
,   require("../rules/headers/logo")
,   require("../rules/headers/h1-title")
,   require("../rules/headers/dl")
,   require("../rules/headers/h2-status")

,   require("../rules/style/sheet")

,   require("../rules/sotd/supersedable")

,   require("../rules/structure/h2")
,   require("../rules/structure/section-ids")

// ,   require("../rules/links/internal")
,   require("../rules/links/linkchecker")

,   require("../rules/validation/html")
,   require("../rules/validation/css")
,   require("../rules/heuristic/group")
];
