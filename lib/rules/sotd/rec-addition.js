const self = {
    name: 'sotd.rec-addition',
    section: 'document-status',
    rule: 'recAddition',
};

exports.name = self.name;

const P_CORRECTION = 'Proposed corrections are marked in the document.';
const P_ADDITION = 'Proposed additions are marked in the document.';
const C_CORRECTION = 'Candidate corrections are marked in the document.';
const C_ADDITION = 'Candidate additions are marked in the document.';

// check if the recommendation change type mentioned by text is consistant with the html element.
function checkSection(sr, options) {
    if (options.typeOfRec) {
        if (options.htmlSection) {
            if (
                sr.norm(options.htmlSection.textContent) !==
                options.expectedText
            ) {
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
        const pCorSection = sr.jsDocument.querySelector('.correction.proposed');
        const pAddSection = sr.jsDocument.querySelector('.addition.proposed');
        const cCorSection = sr.jsDocument.querySelector('.correction');
        const cAddSection = sr.jsDocument.querySelector('.addition');

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
            typeOfRec: recType.pNewAdditions,
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
            typeOfRec: recType.cNewAdditions,
            htmlSection: cAddSection,
            expectedText: C_ADDITION,
            typeOfChange: 'candidate additions',
            sectionClass: 'addition',
        });
    }
    return done();
};
