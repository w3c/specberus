// headers
//  must include a public archived place to send comments to.
//  below:

const self = {
    name: 'headers.github-repo',
    section: 'front-matter',
    rule: 'docIDOrder',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const dts = sr.extractHeaders();
    // Check 'Feedback:' exist
    if (!dts.Feedback) {
        sr.error(self, 'no-feedback');
        return done();
    }

    // Check 'github repo' exist in 'Feedback:'
    const feedbackDD = dts.Feedback.dd;
    const foundRepo = feedbackDD.some(feedbackEle => {
        const links = Array.from(feedbackEle.querySelectorAll('a[href]')).map(
            e => e.href
        );
        // const href = feedbackEle.querySelector('a[href]').getAttribute('href');
        return links.some(l =>
            /^https:\/\/github.com\/[\w-]+\/[\w-]+\/(issues($|\/)|labels\/[\w-]+)/.test(
                l
            )
        );
        // eg: https://github.com/xxx/xxx/issues/
        // return /^https:\/\/github.com\/[\w-]+\/[\w-]+\/(issues($|\/)|labels\/[\w-]+)/.test(
        //     href
        // );
    });
    if (!foundRepo) sr.error(self, 'no-repo');

    done();
};
