import type { ResponseError } from 'superagent';
import { get } from '../../throttled-ua.js';
import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'links.compound',
};
const TIMEOUT = 10000;

export const { name } = self;

export const check: RuleCheckFunction = sr => {
    const { validation } = sr.config!;
    const url = sr.url!;

    if (validation !== 'recursive') {
        sr.warning(self, 'skipped');
        return;
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

    if (!links.length) return;

    const markupService = 'https://validator.w3.org/nu/';
    return Promise.all(
        links.map(l => {
            const ua = `W3C-Pubrules/${sr.version}`;
            const req = get(markupService)
                .set('User-Agent', ua)
                .query({ doc: l, out: 'json' })
                .on('error', err => {
                    sr.error(self, 'error', {
                        file: l.split('/').pop(),
                        link: l,
                        errMsg: err,
                    });
                })
                .timeout(TIMEOUT);
            return req.then(
                res => {
                    const json = res.body;
                    if (!json)
                        throw new Error(
                            'No JSON returned from HTML validator.'
                        );

                    const errors =
                        json.messages?.filter(
                            (msg: { type: string }) => msg.type === 'error'
                        ) || [];
                    if (errors.length === 0) {
                        sr.info(self, 'link', {
                            file: l.split('/').pop(),
                            link: l,
                            markup: '\u2714',
                        });
                    } else {
                        sr.error(self, 'link', {
                            file: l.split('/').pop(),
                            link: l,
                            markup: '\u2718',
                        });
                    }
                },
                (err: ResponseError) => {
                    if (err.timeout) sr.warning(self, 'html-timeout');
                    else
                        throw new Error(`HTML validator error: ${err.message}`);
                }
            );
        })
    ).then(() => {});
};
