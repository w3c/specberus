// take an array of rules, return a copy with new rules added after a given named anchor
exports.insertAfter = function (original, anchor, rules) {
    rules = Array.isArray(rules) ? rules : [rules];
    original = original.slice();
    const index = original.map(r => r.name).indexOf(anchor);
    if (index < 0) return original.concat(rules);

    rules.forEach(r => {
        // see if the rule to be inserted already exists.
        const rIndex = original.map(rule => rule.name).indexOf(r.name);
        if (rIndex < 0) original.splice(index, 0, r);
        else
            console.error(
                `[EXCEPTION] Error when insertAfter, ${r.name} already exists at position ${rIndex} of the original list`
            );
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
        } else {
            console.error(
                `[EXCEPTION] Error when removeRules, ${r} doesn't exist in the original list`
            );
        }
    });
    return original;
};
