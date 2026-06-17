import type { RuleCheckFunction } from '../../types.js';

export const name = 'structure.display-only';

export const check: RuleCheckFunction = context => {
    if (context.config!.status !== 'DISC')
        context.info(
            { name, section: 'document-status', rule: 'customParagraph' },
            'customised-paragraph'
        );

    context.info(
        { name, section: 'document-status', rule: 'knownDisclosureNumber' },
        'known-disclosures'
    );
    context.info({ name }, 'normative-representation');
    context.info({ name }, 'visual-style');
    context.info({ name }, 'alt-representation');
    context.info({ name }, 'special-box-markup');
    context.info({ name }, 'index-list-tables');
    context.info({ name }, 'fit-in-a4');
};
