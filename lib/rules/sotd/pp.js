const PowerPromise = require('promise');
const w3capi = require('node-w3capi');
const util = require('../../util');

const self = {
    name: 'sotd.pp',
};

function buildWanted(groups, sr, isIGDeliverable) {
    const { config } = sr;
    let wanted;
    const result = {};
    const isPP2002 = config.patentPolicy === 'pp2002';
    const isWGNote = config.longStatus === 'Working Group Note';
    const isAmended = config.amended;
    if (isPP2002)
        wanted =
            'This document is governed by the 24 January 2002 CPP as amended by the W3C Patent ' +
            'Policy Transition Procedure\\. ';
    else {
        const start = !isAmended
            ? 'This document '
            : 'The Recommendation from which this document is derived ';
        wanted = `${start}was produced by ${
            groups.length === 2 ? 'groups ' : 'a group '
        }operating under the( 15 September 2020| 1 August 2017)? W3C Patent Policy\\. ?`;

        const noRec = `${
            groups.length === 2 ? 'The groups do not ' : 'The group does not '
        }expect this document to become a W3C Recommendation\\. ?`;
        if (config.track !== 'REC' || isIGDeliverable) wanted += noRec;
        else if (isWGNote) wanted += `(${noRec})?`;

        if (config.informativeOnly && config.track !== 'NOTE')
            wanted += 'This document is informative only\\. ';
    }
    if (!isWGNote) {
        wanted += 'W3C maintains ';
        if (groups.length < 2) {
            wanted += 'a public list of any patent disclosures';
        } else {
            wanted += groups
                .map(
                    wg =>
                        `a public list of any patent disclosures \\(${wg.replace(
                            ' Working Group',
                            ''
                        )}( Working Group)?\\)`
                )
                .join(' and ');
        }
        wanted += ` made in connection with the deliverables of ${
            groups.length === 2
                ? 'each group; these pages also include '
                : 'the group; that page also includes '
        }instructions for disclosing a patent\\.`;
        if (config.track === 'REC' || config.track === 'NOTE' || isPP2002)
            wanted +=
                ' An individual who has actual knowledge of a patent which the individual ' +
                'believes contains Essential Claim\\(s\\) must disclose the information in ' +
                'accordance with section 6 of the W3C Patent Policy\\.';
        if (isAmended)
            wanted +=
                ' This Amended Recommendation was produced by incorporating errata after that group closed\\.';
    }
    wanted = `^${wanted}$`;
    result.regex = new RegExp(wanted);
    result.text = wanted.replace(/\\/g, '');
    return result;
}

function findPP(candidates, sr, isIGDeliverable) {
    let pp = null;
    const groups = [];
    const jointRegex = new RegExp(
        'This document was (?:produced|published) by the (.+? Working Group|Technical Architecture Group)' +
            ' and the (.+? Working Group|Technical Architecture Group)'
    );
    Array.prototype.some.call(candidates, p => {
        const text = sr.norm(p.textContent);
        if (jointRegex.test(text)) {
            const matches = text.match(jointRegex);
            groups.push(matches[1]);
            groups.push(matches[2]);
            sr.warning(self, 'joint-publication');
            return true;
        }
    });
    const wanted = buildWanted(groups, sr, isIGDeliverable);
    const expected = wanted.text;
    Array.prototype.some.call(candidates, p => {
        const text = sr.norm(p.textContent);
        if (wanted.regex.test(text)) {
            pp = p;
            return true;
        }
    });
    return { pp, expected };
}

function fetchGroupNames(deliverIds) {
    const promiseArray = [];
    deliverIds.forEach(deliverId => {
        promiseArray.push(
            new PowerPromise((resolve, reject) => {
                w3capi.apiKey = process.env.W3C_API_KEY;
                w3capi.group(deliverId).fetch((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.name);
                    }
                });
            })
        );
    });
    return promiseArray;
}

exports.name = self.name;

const selfDisclosures = {
    name: 'sotd.pp',
    section: 'document-status',
    rule: 'patPolReq',
};

exports.check = async function (sr, done) {
    // Make sure joint publication uses the same Patent Policy.
    const patentPolicies = await sr.getPatentPolicies();
    if (patentPolicies.length > 1) {
        patentPolicies.forEach(patentPolicyLink => {
            if (patentPolicyLink !== patentPolicies[0]) {
                sr.error(self, 'joint-different-pp');
                return done();
            }
        });
    }

    const sotd = sr.getSotDSection();
    const isPP2002 = sr.config.patentPolicy === 'pp2002';
    const isWGNote = sr.config.longStatus === 'Working Group Note';
    const isAmended = sr.config.amended;
    const ppLink = 'https://www.w3.org/Consortium/Patent-Policy/';
    const pp2020 = 'https://www.w3.org/Consortium/Patent-Policy-20200915/';
    const pp2017 = 'https://www.w3.org/Consortium/Patent-Policy-20170801/';
    let patent = sr.config.patentPolicy;
    if (sr.config.patentPolicy === 'pp2020') {
        patent = pp2020;
    } else if (sr.config.patentPolicy === 'pp2004') {
        patent = pp2017;
    }

    // Make sure the pp version is consitant between the UI or the one defined in the charter.
    if (patentPolicies[0] && patentPolicies[0] !== patent) {
        sr.error(self, 'wrong-pp-from-charter', {
            pp_charter: patentPolicies[0],
            pp_config: patent,
        });
        return done();
    }

    const deliverers = await sr.getDelivererIDs();
    // Skip patent policy check for publications from TAG
    if (deliverers.includes(util.TAG_ID)) return done();

    let isIGDeliverable = false;

    if (sotd) {
        if (!patent) {
            sr.error(self, 'undefined');
            return done();
        }

        // Use Promise.all to get Group Names, if groups include IG, will check `noRec` sentence in patent policy paragraph.
        await Promise.all(fetchGroupNames(deliverers))
            .then(groupNames => {
                isIGDeliverable = groupNames.some(groupName =>
                    groupName.endsWith('Interest Group')
                );
            })
            .catch(e => {
                sr.error(self, 'no-response', { error: JSON.stringify(e) });
                return done();
            });

        const { pp, expected } = findPP(
            util.filter(sotd, 'p').concat(...sotd.querySelectorAll('p')),
            sr,
            isIGDeliverable
        );
        if (!pp) {
            sr.error(self, 'no-pp', { expected });
            return done();
        }

        let possiblePP = [];
        if (patent === pp2020) {
            possiblePP = [ppLink, pp2020];
        } else if (patent === pp2017) {
            possiblePP = [pp2017];
        }

        let found2017 = false;
        let found2020 = false;
        let foundPublicList = false;
        let foundEssentials = false;
        let foundSection6 = false;
        let foundJan24 = false;
        let foundPPTransition = false;
        let foundErrata = false;
        pp.querySelectorAll('a[href]').forEach(a => {
            const href = a.getAttribute('href');
            const text = sr.norm(a.textContent);
            if (
                patent === pp2020 &&
                possiblePP.includes(href) &&
                /(15 September 2020 )?W3C Patent Policy/.test(text)
            ) {
                found2020 = true;
                return;
            }

            if (
                patent === pp2017 &&
                possiblePP.includes(href) &&
                /(1 August 2017 )?W3C Patent Policy/.test(text)
            ) {
                found2017 = true;
                return;
            }
            if (
                /^https:\/\/www\.w3\.org\/(groups\/[^/]+\/[^/]+\/ipr|2004\/01\/pp-impl\/\d+\/status)(#.*)?$/.test(
                    href
                ) &&
                /public list of any patent disclosures( \(.+\))?/.test(text) &&
                a.getAttribute('rel') === 'disclosure'
            ) {
                foundPublicList = true;
                return;
            }

            if (
                possiblePP.map(p => `${p}#def-essential`).includes(href) &&
                text === 'Essential Claim(s)'
            ) {
                foundEssentials = true;
                return;
            }
            if (
                possiblePP.map(p => `${p}#sec-Disclosure`).includes(href) &&
                text === 'section 6 of the W3C Patent Policy'
            ) {
                foundSection6 = true;
                return;
            }
            if (
                href ===
                    'https://www.w3.org/TR/2002/NOTE-patent-practice-20020124' &&
                text === '24 January 2002 CPP'
            ) {
                foundJan24 = true;
                return;
            }
            if (
                href === 'https://www.w3.org/2004/02/05-pp-transition' &&
                text === 'W3C Patent Policy Transition Procedure'
            ) {
                foundPPTransition = true;
                return;
            }
            if (isAmended && text === 'errata') {
                foundErrata = true;
            }
        });

        if (!foundJan24 && isPP2002) sr.error(self, 'no-jan24');
        if (!foundPPTransition && isPP2002) sr.error(self, 'no-pp-transition');
        if (!isPP2002) {
            if (patent === pp2017 && !found2017) sr.error(self, 'no-pp2017');
            else if (patent === pp2020 && !found2020)
                sr.error(self, 'no-pp2020');
            else if (!found2017 && !found2020)
                sr.error(self, 'no-pp-link', { expected });
        }
        if (!foundPublicList && !isWGNote)
            sr.error(selfDisclosures, 'no-disclosures');
        if (
            (sr.config.track === 'REC' || sr.config.track === 'NOTE') &&
            !isWGNote &&
            !foundEssentials
        )
            sr.error(self, 'no-claims', {
                link: `${possiblePP[0]}#def-essential`,
            });
        if (
            (sr.config.track === 'REC' || sr.config.track === 'NOTE') &&
            !isWGNote &&
            !foundSection6
        )
            sr.error(self, 'no-section6', {
                link: `${possiblePP[0]}#sec-Disclosure`,
            });
        if (isAmended && !foundErrata) sr.error(self, 'no-errata');
        return done();
    }
};
