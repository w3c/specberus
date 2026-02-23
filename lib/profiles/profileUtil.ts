import type { Rule } from '../types.js';

/**
 * Takes an array of rules, returns a copy with new rules added after a given named anchor
 */
export function insertAfter(
    original: Rule[],
    anchor: string,
    newRules: Rule | Rule[]
) {
    newRules = Array.isArray(newRules) ? newRules : [newRules];
    original = original.slice();
    const index = original.map(r => r.name).indexOf(anchor);
    if (index < 0) return original.concat(newRules);

    newRules.forEach(newRule => {
        // see if the rule to be inserted already exists.
        const rIndex = original.map(rule => rule.name).indexOf(newRule.name);
        if (rIndex < 0) original.splice(index, 0, newRule);
        else
            console.error(
                `[EXCEPTION] Error when insertAfter, ${newRule.name} already exists at position ${rIndex} of the original list`
            );
    });
    return original;
}

/**
 * Takes an array of rules, returns a copy with specified rules removed
 * e.g. profileUtil.removeRules(rules, "sotd.pp")
 *
 * @param original
 * @param ruleNames
 */
export function removeRules(original: Rule[], ruleNames: string | string[]) {
    ruleNames = Array.isArray(ruleNames) ? ruleNames : [ruleNames];
    original = original.slice();
    ruleNames.forEach(name => {
        const index = original.map(rule => rule.name).indexOf(name);
        if (index >= 0) {
            original.splice(index, 1);
        } else {
            console.error(
                `[EXCEPTION] Error when removeRules, ${name} doesn't exist in the original list`
            );
        }
    });
    return original;
}
