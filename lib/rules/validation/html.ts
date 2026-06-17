import type { ResponseError } from 'superagent';
import { get, post } from '../../throttled-ua.js';
import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'validation.html',
    section: 'format',
    rule: 'validHTML',
};
const TIMEOUT = 10000;

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const { htmlValidator, skipValidation } = context.config!;
    const service = htmlValidator || 'https://validator.w3.org/nu/';
    if (skipValidation) {
        context.warning(self, 'skipped');
        return;
    }
    if (!context.url && !context.source) {
        context.warning(self, 'no-source');
        return;
    }
    let req;
    const ua = `W3C-Pubrules/${context.version}`;
    if (context.url) {
        req = get(service).set('User-Agent', ua);
        req.query({ doc: context.url, out: 'json' });
    } else {
        req = post(service)
            .set('User-Agent', ua)
            .set('Content-Type', 'text/html')
            .send(context.source)
            .query({ out: 'json' });
    }
    req.timeout(TIMEOUT);
    return req.then(
        res => {
            if (!res.ok)
                return context.error(self, 'failure', { status: res.status });

            const json = res.body;
            if (!json) throw new Error('No JSON returned from HTML validator.');

            if (json.messages && json.messages.length) {
                for (let i = 0, n = json.messages.length; i < n; i += 1) {
                    const msg = json.messages[i];
                    // {
                    //     "type": "error",
                    //     "lastLine": 26,
                    //     "lastColumn": 14,
                    //     "firstColumn": 7,
                    //     "message": "blah",
                    //     "extract": "er>\n <hgroup>\n ",
                    //     "hiliteStart": 10,
                    //     "hiliteLength": 8
                    // }
                    if (msg.type === 'error') {
                        context.error(self, 'error', {
                            line: msg.lastLine,
                            column: msg.lastColumn,
                            message: msg.message,
                            link: `${service}?doc=${context.url}`,
                        });
                    }
                    // {
                    //     "type": "info",
                    //     "url": "https://www.google.com/",
                    //     "subType": "warning",
                    //     "message": "blah"
                    // }
                    else if (msg.type === 'info') {
                        if (msg.subtype === 'warning') {
                            context.warning(self, 'warning', {
                                message: msg.message,
                                link: `${service}?doc=${context.url}`,
                            });
                        }
                    }
                    // {
                    //     "type":"non-document-error",
                    //     "subType":"io",
                    //     "message":"HTTP resource not retrievable. The HTTP status from the remote server was: 404."
                    // }
                    else if (msg.type === 'non-document-error') {
                        context.error(self, 'non-document-error', {
                            subType: msg.subType,
                            message: msg.message,
                        });
                    }
                }
            }
        },
        (err: ResponseError) => {
            if (err.timeout) context.warning(self, 'timeout');
            else context.error(self, 'no-response');
        }
    );
};
