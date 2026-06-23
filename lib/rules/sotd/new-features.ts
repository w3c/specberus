import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'sotd.new-features',
    section: 'document-status',
    rule: 'newFeatures',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const $sotd = context.getSotDSection();
    const docType = `${context.config!.status !== 'REC' ? 'upcoming ' : ''}Recommendation`;
    const warning = new RegExp(
        `Future updates to this ${docType} may incorporate new features.`
    );
    const linkTxt = 'new features';
    const linkHref =
        'https://www.w3.org/policies/process/20250818/#allow-new-features';

    if ($sotd && context.norm($sotd.text()).match(warning)) {
        const foundLink = $sotd
            .find('a')
            .toArray()
            .some(
                a =>
                    context.norm(context.$(a).text()) === linkTxt &&
                    a.attribs.href === linkHref
            );
        if (!foundLink) {
            context.error(self, 'no-link');
        }
    } else {
        context.warning(self, 'no-warning');
    }
};
