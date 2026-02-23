import rules from "../../rules.json" with { type: "json" };
import type { RuleCheckFunction } from "../../types.js";
import { isRuleTrack } from "../../util.js";

const self = {
    name: 'headers.w3c-state',
    section: 'front-matter',
    rule: 'dateState',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    const config = sr.config!;
    let profileFound = false;

    if (config.longStatus) return done();
    const $stateEl = sr.getDocumentStateElement();
    if (!$stateEl) {
        sr.error(self, 'no-w3c-state');
        return done();
    }
    const txt = sr.norm($stateEl.text());
    // crType/cryType: Add 'Draft', 'Snapshot' suffix to title.
    const docTitle =
        config.longStatus +
        (config.crType ? ` ${config.crType}` : '') +
        (config.cryType ? ` ${config.cryType}` : '');
    if (!txt.startsWith(`W3C ${docTitle}`)) {
        sr.error(self, 'bad-w3c-state');
    }

    for (const t in rules)
        if (isRuleTrack(t) && !profileFound)
            for (const profile of Object.values(rules[t].profiles)) {
                const rx = new RegExp(
                    `^w3c\\ ${profile.name}(\\ |,)`,
                    'i'
                );
                if (rx.test(txt)) {
                    profileFound = true;
                    break;
                }
            }

    if (!profileFound) sr.error(self, 'bad-w3c-state');
    else {
        // check the profile link
        const $standardLink = $stateEl.find('a').first();
        let hash = config.status;
        // mapping special hash.
        if (config.longStatus === 'First Public Working Draft') {
            hash = 'FPWD';
        }
        const expectedLink = new RegExp(
            `https://www.w3.org/standards/types/?#${hash}`
        );
        if (!$standardLink.length) {
            sr.error(self, 'no-w3c-state-link');
        } else if (!expectedLink.test($standardLink.attr('href') || "")) {
            sr.error(self, 'wrong-w3c-state-link', {
                hash,
                linkFound: $standardLink.attr('href'),
                text: sr.norm($standardLink.text()),
            });
        }
    }

    done();
}
