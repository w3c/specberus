const fs = require('fs');

const original = require('../lib/rules-wrapper');

const texts = {};

var total = 0,
    unique = 0,
    analogous = 0,
    instances = 0,
    redundant = 0,
    suspects = [];

const normaliseCopy = (c) => {
    return c.toLowerCase().replace(/[\s,\.]/g, '');
};

for (let p in original)
    for (let s in original[p].sections)
        for (let r in original[p].sections[s].rules) {
            if (texts.hasOwnProperty(original[p].sections[s].rules[r]))
                texts[original[p].sections[s].rules[r]].push({p: p, s: s, sectionName: original[p].sections[s].name, r: r});
            else
                texts[original[p].sections[s].rules[r]] = [{p: p, s: s, sectionName: original[p].sections[s].name, r: r}];
            total++;
        }

for (let t in texts)
    if (1 === texts[t].length)
        unique++;
    else {
        const equalToFirst = (e) => (e.s === texts[t][0].s && e.sectionName === texts[t][0].sectionName && e.r === texts[t][0].r);
        if (texts[t].every(equalToFirst)) {
            instances += texts[t].length;
            analogous++;
        } else
            redundant++;
    }

console.log(`Analogous: ${analogous} (${instances} instances); redundant: ${redundant}; unique: ${unique}. Total: ${total}`);

const compact = JSON.parse(JSON.stringify(original));

if (analogous > 0)
    compact['*'] = {sections: {}};

for (let t in texts)
    if (texts[t].length > 1) {
        const equalToFirst = (e) => (e.s === texts[t][0].s && e.sectionName === texts[t][0].sectionName && e.r === texts[t][0].r);
        if (texts[t].every(equalToFirst)) {
            const sample = texts[t][0];
            if (compact['*'].sections.hasOwnProperty(sample.s))
                compact['*'].sections[sample.s].rules[sample.r] = t;
            else {
                const rules = {};
                rules[sample.r] = t;
                compact['*'].sections[sample.s] = {name: sample.sectionName, rules: rules};
            }
            for (let item in texts[t]) {
                const e = texts[t][item];
                // delete compact[e.p].sections[e.s].rules[e.r];
                compact[e.p].sections[e.s].rules[e.r] = true;
                if (Object.keys(compact[e.p].sections[e.s].rules).length < 1) {
                    // delete compact[e.p].sections[e.s];
                    compact[e.p].sections[e.s] = true;
                    if (Object.keys(compact[e.p].sections).length < 1)
                        delete compact[e.p];
                }

            }
        }
    } else
        suspects.push(normaliseCopy(t));

suspects = suspects.sort();

for (let s in suspects)
    console.log(suspects[s].substr(0, 200));

fs.writeFile('../lib/rules.json', JSON.stringify(compact, null, 4));
