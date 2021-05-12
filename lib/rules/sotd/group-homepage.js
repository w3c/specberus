const sua = require('../../throttled-ua');

const self = {
    name: 'sotd.group-homepage',
    section: 'document-status',
    rule: 'WGLink',
};

exports.name = self.name;

exports.check = async function (sr, done) {
    const deliverers = await sr.getDelivererIDs();
    const ua = `W3C-Pubrules/${sr.version}`;
    const sotd = sr.getSotDSection();
    let count = 0;
    const apikey = process.env.W3C_API_KEY;
    if (deliverers.length === 0) {
        sr.error(self, 'no-group');
        return done();
    }
    if (!apikey) {
        // Omitting 'section' & 'rule' on purpose: the error is not about the rule, but about local config.
        sr.error({ name: self.name }, 'no-key');
        return done();
    }
    for (let i = 0; i < deliverers.length; i++) {
        const url = `https://api.w3.org/groups/${deliverers[i]}`;
        const req = sua.get(url).set('User-Agent', ua);
        req.query({ apikey });
        // eslint-disable-next-line
        req.end(function (err, res) {
            if (err || !res.ok) {
                sr.error(self, 'no-response', {
                    status: res ? res.status : err || 'error',
                });
            } else {
                const homepage = res.body._links.homepage.href;
                let found = false;
                if (sotd) {
                    Array.prototype.some.call(
                        sotd.querySelectorAll('a[href]'),
                        (element) => {
                            const href = element.getAttribute('href');
                            if (
                                href ===
                                    homepage.replace(/^http(s)?:/, 'http:') ||
                                href ===
                                    homepage.replace(/^http(s)?:/, 'https:')
                            ) {
                                found = true;
                                return true;
                            }
                        }
                    );
                }

                if (!found) {
                    sr.error(self, 'no-homepage', { homepage });
                }
            }
            count++;
            if (count === deliverers.length) {
                done();
            }
        });
    }
};
