/**
 * Views.
 */

// Internal packages:
const source = require('./rules');

var result = []
,   profile
,   p
,   section
,   s
,   rule
,   r
;

/**
 * @TODO Document.
 */

const compareByFieldName = function(a, b) {
    if(a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
    else if (a.name.toLowerCase() > b.name.toLowerCase())
        return +1;
    else
        return 0;
};

for (p in source.profiles) {
    profile = {abbr: p, name: source.profiles[p].profile, sections: []};
    for (s in source.profiles[p].section) {
        section = {abbr: s, name: source.profiles[p].section[s].name, rules: []};
        for (r in source.profiles[p].section[s].rules) {
            rule = {abbr: r, text: source.profiles[p].section[s].rules[r]};
            section.rules.push(rule);
            section[r] = rule;
        }
        profile.sections.push(section);
        profile[s] = section;
    }
    profile.sections = profile.sections.sort(compareByFieldName);
    result.push(profile);
    exports[p] = profile;
}
result = result.sort(compareByFieldName);

exports.rules = result;
