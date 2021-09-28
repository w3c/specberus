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
    const dts = sr.extractHeaders();
    // Check 'Feedback:' exist
    if (!dts.Feedback) {
        sr.error(self, 'no-feedback');
        return done();
    }

    // Check 'github repo' exist in 'Feedback:'
    const feedbackDD = dts.Feedback.dd;
    const foundRepo = feedbackDD.some(feedbackEle => {
        const href = feedbackEle.querySelector('a[href]').getAttribute('href');
        // eg: https://github.com/xxx/xxx/issues/
        return /^https:\/\/github.com\/[\w-]+\/[\w-]+\/(issues($|\/)|labels\/[\w-]+)/.test(
            href
        );
    });
    if (!foundRepo) sr.error(self, 'no-repo');

    done();
};
