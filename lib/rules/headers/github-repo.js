// headers
//  must include a public archived place to send comments to.
//  below:

const self = {
    name: 'headers.github-repo',
    section: 'front-matter',
    rule: 'gitRepo',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const dl = sr.jsDocument.querySelector('body div.head dl');
    if (dl) {
        let foundRepo = false;
        dl.querySelectorAll('a[href]').forEach((a) => {
            const href = a.getAttribute('href');
            // eg: https://github.com/xxx/xxx/issues/
            if (
                /^https:\/\/github.com\/[\w-]+\/[\w-]+\/(issues($|\/)|labels\/[\w-]+)/.test(
                    href
                )
            ) {
                foundRepo = true;
            }
        });
        if (!foundRepo) sr.error(self, 'no-repo');
    }
    done();
};
