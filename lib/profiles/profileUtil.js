// take an array of rules, return a copy with new rules added after a given named anchor
exports.insertAfter = function (original, anchor, rules) {
    rules = Array.isArray(rules) ? rules : [rules];
    original = original.slice();
    let index = original.map(r => r.name).indexOf(anchor);
    if (index < 0) return original.concat(rules);

    rules.forEach(r => {
        original.splice(index, 0, r);
        index++;
    });
    return original;
};

// take an array of rules, return a copy with specified rules removed
// e.g. profileUtil.removeRules(rules, "sotd.pp")
exports.removeRules = function (original, rules) {
    rules = Array.isArray(rules) ? rules : [rules];
    original = original.slice();
    rules.forEach(r => {
        const index = original.map(rule => rule.name).indexOf(r);
        if (index >= 0) {
            original.splice(index, 1);
        }
    });
    return original;
};
