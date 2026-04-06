import type { RuleCheckFunction } from '../../types.js';

export const name = 'structure.display-only';

export const check: RuleCheckFunction = (sr, done) => {
    if (sr.config!.status !== 'DISC')
        sr.info(
            { name, section: 'document-status', rule: 'customParagraph' },
            'customised-paragraph'
        );

    sr.info(
        { name, section: 'document-status', rule: 'knownDisclosureNumber' },
        'known-disclosures'
    );
    sr.info({ name }, 'normative-representation');
    sr.info({ name }, 'visual-style');
    sr.info({ name }, 'alt-representation');
    sr.info({ name }, 'special-box-markup');
    sr.info({ name }, 'index-list-tables');
    sr.info({ name }, 'fit-in-a4');
    done();
};
