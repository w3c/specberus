const url = require('url');
const sua = require('../../throttled-ua');

const self = {
    name: 'links.compound',
};
const TIMEOUT = 10000;

exports.name = self.name;

exports.check = function (sr, done) {
    if (sr.config.validation !== 'recursive') {
        sr.warning(self, 'skipped');
        return done();
    }

    let links = [];

    if (sr.url) {
        sr.jsDocument.querySelectorAll('a[href]').forEach(element => {
            const u = new url.URL(element.getAttribute('href'), sr.url);
            const l = u.origin + u.pathname;
            if (l.startsWith(sr.url) && l !== sr.url) links.push(l);
        });
    }
    // sort and remove duplicates
    links = links.sort().filter((item, pos) => !pos || item !== links[pos - 1]);

    const markupService = 'https://validator.w3.org/nu/';
    let count = 0;
    if (links.length > 0) {
        links.forEach(l => {
            if (sr.config.validation === 'recursive') {
                const ua = `W3C-Pubrules/${sr.version}`;
                let isMarkupValid = false;
                const req = sua
                    .get(markupService)
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
                            msg => msg.type === 'error'
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
