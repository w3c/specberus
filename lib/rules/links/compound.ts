import { get } from '../../throttled-ua.js';
import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'links.compound',
};
const TIMEOUT = 10000;

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    const { validation } = sr.config!;
    const url = sr.url!;

    if (validation !== 'recursive') {
        sr.warning(self, 'skipped');
        return done();
    }

    let links: string[] = [];

    if (url) {
        sr.$('a[href]').each((_, el) => {
            const u = new URL(el.attribs.href, url);
            const l = u.origin + u.pathname;
            if (l.startsWith(url) && l !== url) links.push(l);
        });
    }
    // sort and remove duplicates
    links = links.sort().filter((item, pos) => !pos || item !== links[pos - 1]);

    const markupService = 'https://validator.w3.org/nu/';
    let count = 0;
    if (links.length > 0) {
        links.forEach(l => {
            if (validation === 'recursive') {
                const ua = `W3C-Pubrules/${sr.version}`;
                let isMarkupValid = false;
                const req = get(markupService)
                    .set('User-Agent', ua)
                    .query({ doc: l, out: 'json' })
                    .on('error', err => {
                        sr.error(self, 'error', {
                            file: l.split('/').pop(),
                            link: l,
                            errMsg: err,
                        });
                        count += 1;
                    });
                req.timeout(TIMEOUT);
                req.end((err1, res) => {
                    if (err1 && err1.timeout === TIMEOUT)
                        sr.warning(self, 'html-timeout');
                    const json = res ? res.body : null;
                    if (!json) return sr.throw('No JSON input.');
                    if (json.messages) {
                        const errors = json.messages.filter(
                            (msg: { type: string }) => msg.type === 'error'
                        );
                        if (errors.length === 0) isMarkupValid = true;
                    }
                    if (isMarkupValid) {
                        sr.info(self, 'link', {
                            file: l.split('/').pop(),
                            link: l,
                            markup: '\u2714',
                        });
                    } else {
                        const details = {
                            file: l.split('/').pop(),
                            link: l,
                            markup: isMarkupValid ? '\u2714' : '\u2718',
                        };
                        sr.error(self, 'link', details);
                    }
                    count += 1;
                    if (count === links.length) return done();
                });
            } else {
                sr.info(self, 'no-validation', {
                    file: l.split('/').pop(),
                    link: l,
                });
            }
        });
    } else return done();
};
