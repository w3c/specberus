const util = require('../../util');

const self = {
    name: 'sotd.pp',
};

const ppLink = 'https://www.w3.org/Consortium/Patent-Policy/';
const pp2020 = 'https://www.w3.org/Consortium/Patent-Policy-20200915/';
const pp2017 = 'https://www.w3.org/Consortium/Patent-Policy-20170801/';

function buildWanted(groups, sr, ppLink) {
    const { config } = sr;
    let wanted;
    const result = {};
    const isPP2002 = config.patentPolicy === 'pp2002';
    const isPP2017 = ppLink === pp2017;
    const isRecTrack = config.track === 'Recommendation';
    const isAmended = config.amended;

    let ppText = '( 15 September 2020)?';
    if (isPP2017) ppText = ' 1 August 2017';

    if (isPP2002)
        wanted =
            'This document is governed by the 24 January 2002 CPP as amended by the W3C Patent Policy Transition Procedure\\. ';
    else {
        const start = !isAmended
            ? 'This document '
            : 'The Recommendation from which this document is derived ';
        wanted = `${start}was produced by ${
            groups.length === 2 ? 'groups ' : 'a group '
        }operating under the${ppText} W3C Patent Policy\\. ?`;
    }

    if (isRecTrack) {
        wanted += ' W3C maintains ';
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
        if (
            config.track === 'Recommendation' ||
            config.track === 'Note' ||
            isPP2002
        )
            wanted +=
                ' An individual who has actual knowledge of a patent which the individual ' +
                'believes contains Essential Claim\\(s\\) must disclose the information in ' +
                'accordance with section 6 of the W3C Patent Policy\\.';
        if (isAmended)
            wanted +=
                ' This Amended Recommendation was produced by incorporating errata after that group closed\\.';
    } else {
        // For documents not on REC-track, the sentence is different.
        wanted = `The${ppText} W3C Patent Policy does not carry any licensing requirements or commitments on this document.`;
    }
    console.log('wabt:', wanted);
    result.regex = new RegExp(wanted);
    result.text = wanted.replace(/\\/g, '');
    return result;
}

function findPP(candidates, sr, isIGDeliverable) {
    let pp = null;
    const groups = [];
    const jointRegex = new RegExp(
        'This document was (?:produced|published) by the (.+? Working Group|Technical Architecture Group|Advisory Board)' +
            ' and the (.+? Working Group|Technical Architecture Group|Advisory Board)'
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

exports.name = self.name;

const selfDisclosures = {
    name: 'sotd.pp',
    section: 'document-status',
    rule: 'patPolReq',
};

exports.check = async function (sr, done) {
    // skip tag check for TAG documents.
    const deliverId = await sr.getDelivererIDs();
    const { TAG } = util;
    if (deliverId.indexOf(TAG.id) >= 0) return done();

    const groups = await sr.getDelivererGroups();
    // Check if the document is published by WGs only. If IG/AB/TAG(s) are involved, the document cannot be on REC-track and should have a sentence meaning 'pp does not apply'.
    const publishedByWgOnly = groups.every(group => group.groupType === 'wg');
    console.log('publishedByWgOnly: ', publishedByWgOnly);

    const patentPolicies = await sr.getPatentPolicies();
    console.log('patentPolicies: ', patentPolicies);

    // If published by WG, the WGs should have living charter and operating under PP
    if (publishedByWgOnly && !patentPolicies.length) {
        sr.error(self, 'no-pp-from-charter');
        return done();
    }

    // If published by WG, make sure joint publication uses the same Patent Policy.
    if (publishedByWgOnly && patentPolicies.length > 1) {
        patentPolicies.forEach(patentPolicyLink => {
            if (patentPolicyLink !== patentPolicies[0]) {
                sr.error(self, 'joint-different-pp');
                return done();
            }
        });
    }

    const sotd = sr.getSotDSection();
    const isPP2002 = sr.config.patentPolicy === 'pp2002';
    const isRecTrack = sr.config.track === 'Recommendation';
    const isAmended = sr.config.amended;

    let patent = sr.config.patentPolicy;
    if (sr.config.patentPolicy === 'pp2020') {
        patent = pp2020;
    } else if (sr.config.patentPolicy === 'pp2004') {
        patent = pp2017;
    }
    // If is joint publication and no pp is set, use latest pp
    if (!publishedByWgOnly && patentPolicies.every(pp => pp === undefined)) {
        patent = pp2020;
    }

    // Make sure the pp version is consitant between the UI or the one defined in the charter.
    if (
        publishedByWgOnly &&
        patentPolicies[0] &&
        patentPolicies[0] !== patent
    ) {
        sr.error(self, 'wrong-pp-from-charter', {
            pp_charter: patentPolicies[0],
            pp_config: patent,
        });
        return done();
    }

    if (sotd) {
        if (!patent) {
            sr.error(self, 'undefined');
            return done();
        }

        const { pp, expected } = findPP(
            util.filter(sotd, 'p').concat(...sotd.querySelectorAll('p')),
            sr,
            patentPolicies[0]
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
        if (!foundPublicList && isRecTrack)
            sr.error(selfDisclosures, 'no-disclosures');
        if (
            (sr.config.track === 'Recommendation' ||
                sr.config.track === 'Note') &&
            isRecTrack &&
            !foundEssentials
        )
            sr.error(self, 'no-claims', {
                link: `${possiblePP[0]}#def-essential`,
            });
        if (
            (sr.config.track === 'Recommendation' ||
                sr.config.track === 'Note') &&
            isRecTrack &&
            !foundSection6
        )
            sr.error(self, 'no-section6', {
                link: `${possiblePP[0]}#sec-Disclosure`,
            });
        if (isAmended && !foundErrata) sr.error(self, 'no-errata');
        return done();
    }
};
