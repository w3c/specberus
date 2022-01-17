const util = require('../../util');

const self = {
    name: 'sotd.pp',
    section: 'document-status',
    rule: 'patPolReq',
};

const ppLink = 'https://www.w3.org/Consortium/Patent-Policy/';
const pp2020 = 'https://www.w3.org/Consortium/Patent-Policy-20200915/';
const pp2017 = 'https://www.w3.org/Consortium/Patent-Policy-20170801/';

/**
 * @param groups
 * @param sr
 * @param ppLink
 */
function buildWanted(groups, sr, ppLink) {
    const { config } = sr;
    let wanted;
    const result = {};
    const isPP2017 = ppLink === pp2017;
    const isRecTrack = config.track === 'Recommendation';

    let ppText = '( 15 September 2020)?';
    if (isPP2017) ppText = ' 1 August 2017';

    wanted = `This document was produced by ${
        groups.length === 2 ? 'groups ' : 'a group '
    }operating under the${ppText} W3C Patent Policy\\. ?`;

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
        if (config.track === 'Recommendation' || config.track === 'Note')
            wanted +=
                ' An individual who has actual knowledge of a patent which the individual ' +
                'believes contains Essential Claim\\(s\\) must disclose the information in ' +
                'accordance with section 6 of the W3C Patent Policy\\.';
    } else {
        // For documents not on REC-track, the sentence is different.
        wanted = `The${ppText} W3C Patent Policy does not carry any licensing requirements or commitments on this document.`;
    }
    result.regex = new RegExp(wanted);
    result.text = wanted.replace(/\\/g, '');
    return result;
}

/**
 * @param candidates
 * @param sr
 * @param isIGDeliverable
 */
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

exports.check = async function (sr, done) {
    const groups = await sr.getDelivererGroups();
    // Check if the document is published by WGs only. If IG/AB/TAG(s) are involved, the document cannot be on REC-track and should have a sentence meaning 'pp does not apply'.
    const publishedByWgOnly = groups.every(group => group.groupType === 'wg');

    const patentPolicies = await sr.getPatentPolicies();

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
    const isRecTrack = sr.config.track === 'Recommendation';

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

    // Make sure the pp version is consistent between the UI or the one defined in the charter.
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
            }
        });

        if (patent === pp2017 && !found2017) sr.error(self, 'no-pp2017');
        else if (patent === pp2020 && !found2020) sr.error(self, 'no-pp2020');
        else if (!found2017 && !found2020)
            sr.error(self, 'no-pp-link', { expected });
        if (!foundPublicList && isRecTrack) sr.error(self, 'no-disclosures');
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
        return done();
    }
};
