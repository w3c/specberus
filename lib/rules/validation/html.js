const sua = require('../../throttled-ua');

const self = {
    name: 'validation.html',
    section: 'format',
    rule: 'validHTML',
};
const TIMEOUT = 10000;

exports.name = self.name;

exports.check = function (sr, done) {
    let service = null;
    if (sr.config.htmlValidator !== undefined) {
        service = sr.config.htmlValidator;
    } else {
        service = 'https://validator.w3.org/nu/';
    }
    if (sr.config.skipValidation) {
        sr.warning(self, 'skipped');
        return done();
    }
    if (!sr.url && !sr.source) {
        sr.warning(self, 'no-source');
        return done();
    }
    let req;
    const ua = `W3C-Pubrules/${sr.version}`;
    if (sr.url) {
        req = sua.get(service).set('User-Agent', ua);
        req.query({ doc: sr.url, out: 'json' });
    } else {
        req = sua
            .post(service)
            .set('User-Agent', ua)
            .set('Content-Type', 'text/html')
            .send(sr.source)
            .query({ out: 'json' });
    }
    req.timeout(TIMEOUT);
    req.end((err, res) => {
        if (err) {
            if (err.timeout === TIMEOUT) {
                sr.warning(self, 'timeout');
            } else {
                sr.error(self, 'no-response');
            }
        } else if (!res.ok) {
            sr.error(self, 'failure', { status: res.status });
        } else {
            const json = res.body;
            if (!json) return sr.throw('No JSON input.');

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
                        sr.error(self, 'error', {
                            line: msg.lastLine,
                            column: msg.lastColumn,
                            message: msg.message,
                            link: `${service}?doc=${sr.url}`,
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
                            sr.warning(self, 'warning', {
                                message: msg.message,
                                link: `${service}?doc=${sr.url}`,
                            });
                        }
                    }
                    // {
                    //     "type":"non-document-error",
                    //     "subType":"io",
                    //     "message":"HTTP resource not retrievable. The HTTP status from the remote server was: 404."
                    // }
                    else if (msg.type === 'non-document-error') {
                        sr.error(self, 'non-document-error', {
                            subType: msg.subType,
                            message: msg.message,
                        });
                    }
                }
            }
        }
        done();
    });
};
