/**
 * Pseudo-rule for metadata extraction: profile.
 */

// Internal packages:
const w3capi = require('node-w3capi');
const rules = require('../../rules.json');

w3capi.apiKey = process.env.W3C_API_KEY;

// 'self.name' would be 'metadata.profile'
exports.name = 'metadata.profile';

exports.check = async function (sr, done) {
    let matchedLength = 0;
    let id;
    let profileNode;
    const reviewStatus = new Map();
    let amended = false;

    const stateEle = sr.getDocumentStateElement();
    if (!stateEle) {
        sr.throw(
            'Cannot find the <code>&lt;p id="w3c-state"&gt;</code> element for profile and date.<br><br>Please make sure the <code>&lt;p id="w3c-state"&gt;W3C @@Profile, DD Month Year&lt;/p&gt;</code> element can be selected by <code>document.getElementById(\'w3c-state\')</code>; <br>If you are using bikeshed, please update to the latest version.'
        );
    }
    const candidate = stateEle && sr.norm(stateEle.textContent).toLowerCase();
    if (candidate) {
        for (const t in rules)
            if (t !== '*')
                for (const p in rules[t].profiles) {
                    const name = rules[t].profiles[p].name.toLowerCase();
                    if (
                        candidate.indexOf(name) !== -1 &&
                        matchedLength < name.length
                    ) {
                        id = p;
                        profileNode = stateEle;
                        amended = candidate.endsWith('(amended by w3c)');
                        matchedLength = name.length;
                    }
                }
    }

    reviewStatus.set('CR', 'implementationFeedbackDue');
    reviewStatus.set('PR', 'prReviewsDue');
    reviewStatus.set('CRY', 'cryFeedbackDue');

    function assembleMeta(id, sr) {
        let meta = { profile: id };
        if (reviewStatus.has(id)) {
            const dueDate = sr.getFeedbackDueDate();
            const dates = dueDate && dueDate.valid;
            let res = dates[0];
            if (dates.length === 0 || !res) return done({ profile: id });
            if (dates.length > 1) res = new Date(Math.min.apply(null, dates));

            const d = [
                res.getFullYear(),
                res.getMonth() + 1,
                res.getDate(),
            ].join('-');
            meta[reviewStatus.get(id)] = d;
        }
        if (amended) meta.amended = amended;
        // implementation report
        if (['CR', 'CRD', 'PR', 'REC'].indexOf(id) > -1) {
            const dts = sr.extractHeaders();
            if (dts.Implementation) {
                meta.implementationReport =
                    dts.Implementation.dd.querySelector('a').href;
            }
        }
        if (id === 'REC') {
            meta = sr.getRecMetadata(meta);
        }

        // Get 'track/rectrack' of the document based on id
        // eslint-disable-next-line import/no-dynamic-require
        const { track } = require(`../../profiles/TR/${id}`).config;
        meta.rectrack = track;

        return done(meta);
    }

    const checkRecType = function () {
        if (
            profileNode &&
            profileNode.textContent.indexOf('Candidate Recommendation') > 0
        ) {
            return profileNode.textContent.indexOf('Draft') > 0 ? 'CRD' : 'CR';
        }
        return 'REC';
    };
    if (id) {
        // W3C Candidate Recommendation (CR before 2020/CR snapshot/CR draft), W3C Recommendation will have "REC"
        if (id === 'REC' || id === 'CR') {
            // distingush REC CR CRD
            id = checkRecType(sr);
        }

        if (id === 'CRY') {
            // distingush CRY CRYD
            id = profileNode.textContent.indexOf('Draft') > 0 ? 'CRYD' : 'CRY';
        }
        assembleMeta(id, sr);
    } else {
        const getTitle = require('./title').check;
        let docTitle;
        await getTitle(sr, result => {
            docTitle = result && result.title;
        });
        if (candidate && candidate.indexOf("editor's draft") > -1) {
            sr.throw(
                `[EXCEPTION] The document "${docTitle}" seems to be an Editor's Draft, which is not supported.`
            );
        } else if (
            sr.jsDocument.querySelector(
                'link[href^="https://www.w3.org/StyleSheets/TR/"]'
            )
        ) {
            const { sortedProfiles } = require('../../views');
            let profileList = '';
            sortedProfiles.forEach(category => {
                profileList += `${category.name}<ul>`;
                category.profiles.forEach(profile => {
                    profileList += `<li>W3C state element for <a href="./doc/rules/?profile=${profile.abbr}#dateState">${profile.name}</a></li>`;
                });
                profileList += '</ul>';
            });
            sr.throw(
                `Pubrules is having a hard time identifying the profile of the document "${docTitle}" from its w3c-state element; Please make sure the &lt;p id="w3c-state"&gt; is in a valid format: <pre><code>&lt;p id="w3c-state"&gt;W3C @@type of the document@@ DD Month YYYY&lt;/p&gt;</code></pre>${profileList}`
            );
        } else {
            sr.throw(
                `[EXCEPTION] The document "${docTitle}" could not be parsed, it's neither a TR document nor a Member Submission.`
            );
        }
    }
};
