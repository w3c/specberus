// This rule only apply to REC, check changes with colored background.
const self = {
    name: 'sotd.rec-addition',
    section: 'document-status',
    rule: 'recAddition',
};

exports.name = self.name;

const P_CORRECTION = 'Proposed correction(s)? are marked in the document.';
const P_ADDITION = 'Proposed addition(s)? are marked in the document.';
const C_CORRECTION = 'Candidate correction(s)? are marked in the document.';
const C_ADDITION = 'Candidate addition(s)? are marked in the document.';

/**
 * Check if the recommendation change type mentioned by text is consistent with the html element.
 *
 * @param sr
 * @param options
 */
function checkSection(sr, options) {
    if (options.typeOfRec) {
        if (options.htmlSection) {
            const expectedReg = new RegExp(options.expectedText);
            const text = sr.norm(options.htmlSection.textContent);
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
    } else if (options.htmlSection)
        sr.error(self, 'unnecessary-section', {
            typeOfChange: options.typeOfChange,
            sectionClass: options.sectionClass,
            expectText: options.expectedText,
        });
}

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        const recType = sr.getRecMetadata({});
        const pCorSection = sotd.querySelector('.correction.proposed');
        const pAddSection = sotd.querySelector('.addition.proposed');
        const cCorSection = sotd.querySelector('.correction:not(.proposed)');
        const cAddSection = sotd.querySelector('.addition:not(.proposed)');

        // check for 'proposed corrections'
        checkSection(sr, {
            typeOfRec: recType.pSubChanges,
            htmlSection: pCorSection,
            expectedText: P_CORRECTION,
            typeOfChange: 'proposed corrections',
            sectionClass: 'correction proposed',
        });

        // check for 'proposed additions'
        checkSection(sr, {
            typeOfRec: recType.pNewFeatures,
            htmlSection: pAddSection,
            expectedText: P_ADDITION,
            typeOfChange: 'proposed additions',
            sectionClass: 'addition proposed',
        });

        // check for 'candidate corrections'
        checkSection(sr, {
            typeOfRec: recType.cSubChanges,
            htmlSection: cCorSection,
            expectedText: C_CORRECTION,
            typeOfChange: 'candidate corrections',
            sectionClass: 'correction',
        });

        // check for 'candidate additions'
        checkSection(sr, {
            typeOfRec: recType.cNewFeatures,
            htmlSection: cAddSection,
            expectedText: C_ADDITION,
            typeOfChange: 'candidate additions',
            sectionClass: 'addition',
        });
    }
    return done();
};
