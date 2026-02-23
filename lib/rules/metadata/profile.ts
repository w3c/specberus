/**
 * Pseudo-rule for metadata extraction: profile.
 */

import type { Cheerio } from 'cheerio';
import type { Element } from 'domhandler';

import { allProfiles, isRuleTrack } from '../../util.js';
import type { Specberus } from '../../validator.js';
import { sortedProfiles } from '../../views.js';
import type { RecMetadata, RuleCheckFunction } from '../../types.js';
import { check as getTitle } from './title.js';

import rules from '../../rules.json' with { type: 'json' };

// 'self.name' would be 'metadata.profile'
export const name = 'metadata.profile';

export const check: RuleCheckFunction<RecMetadata> = async (sr, done) => {
    let matchedLength = 0;
    let id;
    let $profileEl: Cheerio<Element> | undefined;
    const reviewStatus = {
        CR: 'implementationFeedbackDue',
        PR: 'prReviewsDue',
        CRY: 'cryFeedbackDue',
    } as const;

    const $stateEl = sr.getDocumentStateElement();
    if (!$stateEl) {
        sr.throw(
            'Cannot find the <code>&lt;p id="w3c-state"&gt;</code> element for profile and date.<br><br>Please make sure the <code>&lt;p id="w3c-state"&gt;<a href="https://www.w3.org/standards/types#@@Profile">W3C @@Profile</a>, DD Month Year&lt;/p&gt;</code> element can be selected by <code>document.getElementById(\'w3c-state\')</code>; <br>If you are using bikeshed, please update to the latest version.'
        );
    }
    const candidate = $stateEl && sr.norm($stateEl.text()).toLowerCase();
    if (candidate) {
        for (const t in rules) {
            if (isRuleTrack(t)) {
                for (const [p, profile] of Object.entries(rules[t].profiles)) {
                    const name = profile.name.toLowerCase();
                    if (
                        candidate.indexOf(name) !== -1 &&
                        matchedLength < name.length
                    ) {
                        id = p;
                        $profileEl = $stateEl;
                        matchedLength = name.length;
                    }
                }
            }
        }
    }

    function assembleMeta(id: string, sr: Specberus) {
        let meta: RecMetadata = { profile: id };
        if (id in reviewStatus) {
            const dueDate = sr.getFeedbackDueDate();
            const dates = dueDate && dueDate.valid;
            let res = dates[0];
            if (dates.length === 0 || !res) return done({ profile: id });
            if (dates.length > 1)
                res = new Date(Math.min(...dates.map(d => +d)));

            meta[reviewStatus[id as keyof typeof reviewStatus]] =
                `${res.getFullYear()}-${res.getMonth() + 1}-${res.getDate()}`;
        }
        // implementation report
        if (['CR', 'CRD', 'PR', 'REC'].includes(id)) {
            const dts = sr.extractHeaders();
            if (dts.Implementation?.$dd?.find('a').length) {
                meta.implementationReport = dts.Implementation.$dd
                    .find('a')
                    .first()
                    .attr('href');
            }
        } else if (id === 'REC') {
            meta = sr.getRecMetadata(meta);
        }

        // Get 'track/rectrack' of the document based on id
        const profileRex = new RegExp(
            `SUBM|(TR/(Registry|Recommendation|Note))/(${id}).js`
        );
        const thisProfile = allProfiles.filter(eachProfile =>
            // eg for eachProfile: 'TR/Note/NOTE-Echidna.js'
            profileRex.test(eachProfile)
        );
        const profileMatch = thisProfile.length
            ? thisProfile[0].match(profileRex)
            : null;
        const track = profileMatch && profileMatch[profileMatch.length - 2];
        meta.rectrack = track;

        return done(meta);
    }

    function checkRecType() {
        if (
            $profileEl &&
            sr.norm($profileEl.text()).indexOf('Candidate Recommendation') > 0
        ) {
            return sr.norm($profileEl.text()).indexOf('Draft') > 0
                ? 'CRD'
                : 'CR';
        }
        return 'REC';
    }
    if (id) {
        // W3C Candidate Recommendation (CR before 2020/CR snapshot/CR draft), W3C Recommendation will have "REC"
        if (id === 'REC' || id === 'CR') {
            // distinguish REC CR CRD
            id = checkRecType();
        }

        if (id === 'CRY') {
            // distinguish CRY CRYD
            id =
                sr.norm($profileEl?.text() || '').indexOf('Draft') > 0
                    ? 'CRYD'
                    : 'CRY';
        }
        assembleMeta(id, sr);
    } else {
        let docTitle;
        await getTitle(sr, result => {
            docTitle = result && result.title;
        });
        if (candidate && candidate.indexOf("editor's draft") > -1) {
            sr.throw(
                `[EXCEPTION] The document "${docTitle}" seems to be an Editor's Draft, which is not supported.`
            );
        } else if (
            sr.$('link[href^="https://www.w3.org/StyleSheets/TR/"]').length
        ) {
            let profileList = '';
            sortedProfiles.forEach(category => {
                profileList += `${category.name}<ul>`;
                category.profiles.forEach(profile => {
                    profileList += `<li>W3C state element for <a href="./doc/rules/?profile=${profile.abbr}#dateState">${profile.name}</a></li>`;
                });
                profileList += '</ul>';
            });
            sr.throw(
                `Pubrules is having a hard time identifying the profile of the document "${docTitle}" from its w3c-state element; Please make sure the &lt;p id="w3c-state"&gt; is in a valid format: <pre><code>&lt;p id="w3c-state"&gt;<a href="https://www.w3.org/standards/types#@@Profile">W3C @@type of the document@@</a> DD Month YYYY&lt;/p&gt;</code></pre>${profileList}`
            );
        } else {
            sr.throw(
                `[EXCEPTION] The document "${docTitle}" could not be parsed, it's neither a TR document nor a Member Submission.`
            );
        }
    }
};
