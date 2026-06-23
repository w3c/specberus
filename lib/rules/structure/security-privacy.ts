import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'structure.security-privacy',
    section: 'document-body',
    rule: 'securityAndPrivacy',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    let security = false;
    let privacy = false;

    context.$('h2, h3, h4, h5, h6').each((_, el) => {
        const text = context.norm(context.$(el).text()).toLowerCase();

        if (text.includes('security')) {
            security = true;
        }
        if (text.includes('privacy')) {
            privacy = true;
        }
    });

    if (!security && !privacy) {
        context.warning(self, 'no-security-privacy');
    } else {
        if (!security) context.warning(self, 'no-security');

        if (!privacy) context.warning(self, 'no-privacy');
    }
};
