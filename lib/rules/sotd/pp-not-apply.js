const self = {
    name: 'sotd.pp-not-apply',
    section: 'document-status',
    rule: 'ppNotApplies',
};
exports.name = self.name;

exports.check = async function (sr, done) {
    const wanted =
        /The( 15 September 2020)? W3C Patent Policy does not carry any licensing requirements or commitments on this document./;

    const sotd = sr.getSotDSection();
    const candidates = sotd.querySelectorAll('p');

    const ppFound = Array.prototype.filter.call(candidates, p =>
        wanted.test(sr.norm(p.textContent))
    );

    if (!ppFound.length) {
        return sr.error(self, 'no-pp-paragraph', { wanted });
    }

    const linkFound = Array.prototype.filter.call(
        ppFound[0].querySelectorAll('a[href]'),
        a => /W3C Patent Policy/.test(sr.norm(a.textContent))
    );

    if (!linkFound.length) {
        return sr.error(self, 'no-pp-text', { wanted: 'W3C Patent Policy' });
    }

    const href = linkFound[0].getAttribute('href');
    const ppLink = 'https://www.w3.org/Consortium/Patent-Policy/';
    const pp2020 = 'https://www.w3.org/Consortium/Patent-Policy-20200915/';

    if (!href || href !== ppLink || href !== pp2020)
        return sr.error(self, 'no-pp-link', { ppLink, pp2020 });

    return done();
};
