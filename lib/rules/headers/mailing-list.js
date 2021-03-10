// headers
//  must include a public archived place to send comments to.
//  below:

const self = {
    name: 'headers.mailing-list',
    section: 'front-matter',
    rule: 'mailingListName',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const dl = sr.jsDocument.querySelector('body div.head dl');
    if (dl) {
        let foundML = false;
        let foundArch = false;
        let foundRepo = false;
        dl.querySelectorAll('a[href]').forEach((a) => {
            const href = a.getAttribute('href');
            const text = sr.norm(a.textContent).toLowerCase();
            if (
                /^mailto:.+@w3\.org(?:\?subject=.*)?$/i.test(href) &&
                !/.+-request@/.test(href)
            ) {
                foundML = true;
                return;
            }
            if (
                /^https?:\/\/lists\.w3\.org\/Archives\//.test(href) &&
                /archive/i.test(text)
            ) {
                foundArch = true;
                return;
            }
            if (
                /^https:\/\/github.com\/[\w-]+\/[\w-]+\/(issues|labels\/[\w-]+)/.test(
                    href
                )
            ) {
                foundRepo = true;
            }
        });
        if (!foundRepo) sr.error(self, 'no-repo');
        if (!foundML) sr.warning(self, 'no-list');
        if (!foundArch) sr.warning(self, 'no-arch');
    }
    done();
};
