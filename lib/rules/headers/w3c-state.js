import { importJSON } from '../../util.js';

const rules = importJSON('../../rules.json', import.meta.url);

const self = {
    name: 'headers.w3c-state',
    section: 'front-matter',
    rule: 'dateState',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    let profileFound = false;

    if (!sr.config.longStatus) return done();
    const stateEle = sr.getDocumentStateElement();
    if (!stateEle) {
        sr.error(self, 'no-w3c-state');
        return done();
    }
    const txt = sr.norm(stateEle.textContent);
    // crType/cryType: Add 'Draft', 'Snapshot' suffix to title.
    const docTitle =
        sr.config.longStatus +
        (sr.config.crType ? ` ${sr.config.crType}` : '') +
        (sr.config.cryType ? ` ${sr.config.cryType}` : '');
    if (!txt.startsWith(`W3C ${docTitle}`)) {
        sr.error(self, 'bad-w3c-state');
    }

    for (const t in rules)
        if (t !== '*' && !profileFound)
            for (const p in rules[t].profiles) {
                const rx = new RegExp(
                    `^w3c\\ ${rules[t].profiles[p].name}(\\ |,)`,
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
        const standardLink = stateEle.querySelector('a');
        let hash = sr.config.status;
        // mapping special hash.
        if (sr.config.longStatus === 'First Public Working Draft') {
            hash = 'FPWD';
        }
        const expectedLink = `https://www.w3.org/standards/types#${hash}`;
        if (!standardLink) {
            sr.error(self, 'no-w3c-state-link');
        } else if (standardLink.href !== expectedLink) {
            sr.error(self, 'wrong-w3c-state-link', {
                expectedLink,
                linkFound: standardLink.href,
                text: sr.norm(standardLink.textContent),
            });
        }
    }

    done();
}
