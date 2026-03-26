// headers
//  must include a public archived place to send comments to.
//  below:

import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'headers.github-repo',
    section: 'front-matter',
    rule: 'docIDOrder',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    const dts = sr.extractHeaders();
    if (!dts.Feedback) {
        sr.error(self, 'no-feedback');
        return done();
    }

    // Check 'github repo' exist in 'Feedback:'
    const foundRepo = dts.Feedback.$dd.toArray().some(feedbackEl => {
        const links = sr
            .$(feedbackEl)
            .find('a[href]')
            .toArray()
            .map(el => el.attribs.href);
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
