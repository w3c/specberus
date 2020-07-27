
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

// take an array of rules, return a copy with specified rules removed
// e.g. base.removeRules(rules, "sotd.pp")
exports.removeRules = function (original, rules) {
    rules = Array.isArray(rules) ? rules : [rules];
    original = original.slice();
    rules.forEach(function (r) {
        var index = original.map(function (rule) { return rule.name; }).indexOf(r);
        if (index >= 0) {
            original.splice(index, 1);
        }
    });
    return original;
};

exports.rules = [
    require('../rules/heuristic/shortname')
,   require("../rules/headers/title")
,   require("../rules/headers/div-head")
,   require("../rules/headers/hr")
,   require("../rules/headers/logo")
,   require("../rules/headers/h1-title")
,   require("../rules/headers/dl")
,   require("../rules/headers/h2-status")
,   require("../rules/headers/h2-toc")
,   require("../rules/headers/ol-toc")
,   require("../rules/headers/secno")

,   require("../rules/style/sheet")
,   require("../rules/style/meta")
,   require("../rules/style/body-toc-sidebar")
,   require("../rules/style/script")
,   require("../rules/style/back-to-top")

,   require("../rules/sotd/supersedable")

,   require("../rules/structure/name")
,   require("../rules/structure/h2")
,   require("../rules/structure/canonical")
,   require("../rules/structure/section-ids")
,   require("../rules/structure/display-only")
,   require('../rules/structure/neutral')

// ,   require("../rules/links/internal")
,   require("../rules/links/linkchecker")
,   require("../rules/links/compound")

,   require("../rules/validation/html")
,   require("../rules/validation/css")
,   require('../rules/validation/wcag')
,   require('../rules/heuristic/date-format')
];
