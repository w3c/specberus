import rules from '../../rules-track.js';
import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'headers.w3c-state',
    section: 'front-matter',
    rule: 'dateState',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const config = context.config!;
    let profileFound = false;

    if (config.longStatus) return;
    const $stateEl = context.getDocumentStateElement();
    if (!$stateEl) {
        context.error(self, 'no-w3c-state');
        return;
    }
    const txt = context.norm($stateEl.text());
    // crType/cryType: Add 'Draft', 'Snapshot' suffix to title.
    const docTitle =
        config.longStatus +
        (config.crType ? ` ${config.crType}` : '') +
        (config.cryType ? ` ${config.cryType}` : '');
    if (!txt.startsWith(`W3C ${docTitle}`)) {
        context.error(self, 'bad-w3c-state');
    }

    for (const { profiles } of Object.values(rules))
        if (!profileFound)
            for (const profile of Object.values(profiles)) {
                const rx = new RegExp(`^w3c\\ ${profile.name}(\\ |,)`, 'i');
                if (rx.test(txt)) {
                    profileFound = true;
                    break;
                }
            }

    if (!profileFound) context.error(self, 'bad-w3c-state');
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
            context.error(self, 'no-w3c-state-link');
        } else if (!expectedLink.test($standardLink.attr('href') || '')) {
            context.error(self, 'wrong-w3c-state-link', {
                hash,
                linkFound: $standardLink.attr('href'),
                text: context.norm($standardLink.text()),
            });
        }
    }
};
