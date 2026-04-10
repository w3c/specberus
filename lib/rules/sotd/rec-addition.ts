import type { Cheerio } from 'cheerio';
import type { RuleCheckFunction, RuleMeta } from '../../types.js';
import type { Specberus } from '../../validator.js';
import type { Element } from 'domhandler';

// This rule only apply to REC, check changes with colored background.
const self: RuleMeta = {
    name: 'sotd.rec-addition',
    section: 'document-status',
    rule: 'recAddition',
};

export const { name } = self;

const P_CORRECTION = 'Proposed correction(s)? are marked in the document.';
const P_ADDITION = 'Proposed addition(s)? are marked in the document.';
const C_CORRECTION = 'Candidate correction(s)? are marked in the document.';
const C_ADDITION = 'Candidate addition(s)? are marked in the document.';

interface CheckSectionOptions {
    typeOfRec: boolean | undefined;
    $htmlSection: Cheerio<Element>;
    expectedText: string;
    typeOfChange: string;
    sectionClass: string;
}

/**
 * Check if the recommendation change type mentioned by text is consistent with the html element.
 */
function checkSection(sr: Specberus, options: CheckSectionOptions) {
    if (options.typeOfRec) {
        if (options.$htmlSection.length) {
            const expectedReg = new RegExp(options.expectedText);
            const text = sr.norm(options.$htmlSection.text());
            if (!expectedReg.test(text)) {
                sr.error(self, 'wrong-text', {
                    typeOfChange: options.typeOfChange,
                    sectionClass: options.sectionClass,
                    expectText: options.expectedText,
                });
            }
        } else {
            sr.error(self, 'no-section', {
                typeOfChange: options.typeOfChange,
                sectionClass: options.sectionClass,
                expectText: options.expectedText,
            });
        }
    } else if (options.$htmlSection.length)
        sr.error(self, 'unnecessary-section', {
            typeOfChange: options.typeOfChange,
            sectionClass: options.sectionClass,
            expectText: options.expectedText,
        });
}

export const check: RuleCheckFunction = (sr, done) => {
    const $sotd = sr.getSotDSection();
    if ($sotd) {
        const recType = sr.getRecMetadata();
        const $pCorSection = $sotd.find('p.correction.proposed').first();
        const $pAddSection = $sotd.find('p.addition.proposed').first();
        const $cCorSection = $sotd.find('p.correction:not(.proposed)').first();
        const $cAddSection = $sotd.find('p.addition:not(.proposed)').first();

        // check for 'proposed corrections'
        checkSection(sr, {
            typeOfRec: recType.pSubChanges,
            $htmlSection: $pCorSection,
            expectedText: P_CORRECTION,
            typeOfChange: 'proposed corrections',
            sectionClass: 'correction proposed',
        });

        // check for 'proposed additions'
        checkSection(sr, {
            typeOfRec: recType.pNewFeatures,
            $htmlSection: $pAddSection,
            expectedText: P_ADDITION,
            typeOfChange: 'proposed additions',
            sectionClass: 'addition proposed',
        });

        // check for 'candidate corrections'
        checkSection(sr, {
            typeOfRec: recType.cSubChanges,
            $htmlSection: $cCorSection,
            expectedText: C_CORRECTION,
            typeOfChange: 'candidate corrections',
            sectionClass: 'correction',
        });

        // check for 'candidate additions'
        checkSection(sr, {
            typeOfRec: recType.cNewFeatures,
            $htmlSection: $cAddSection,
            expectedText: C_ADDITION,
            typeOfChange: 'candidate additions',
            sectionClass: 'addition',
        });
    }
    return done();
};
