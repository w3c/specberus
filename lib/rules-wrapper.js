/**
 * Views.
 */

const source = require('./rules');

for (let p in source.profiles) {
    const profile = {name: source.profiles[p].profile, sections: {}};
    for (let s in source.profiles[p].section) {
        const section = {name: source.profiles[p].section[s].name, rules: {}};
        for (let r in source.profiles[p].section[s].rules)
            section.rules[r] = source.profiles[p].section[s].rules[r];
        profile.sections[s] = section;
    }
    exports[p] = profile;
}
