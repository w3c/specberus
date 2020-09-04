const self = {
    name: 'sotd.rec-addition'
,   section: 'document-status'
,   rule: 'recAddition'
};

exports.name = self.name;

const CORRECTION = 'Proposed corrections are marked in the document.';
const ADDITION = 'Proposed additions are marked in the document.';

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    if (sotd) {
        var recType = sr.getRecMetadata({});
        var correctionSection = sr.jsDocument.querySelector('.correction');
        var additionSection = sr.jsDocument.querySelector('.addition');
        // check correction paragraph with yellow background
        if (recType.substantiveChanges) {
            if (correctionSection) {
                if (sr.norm(correctionSection.textContent) !== CORRECTION) {
                    sr.error(self, 'wrong-text', { type: 'correction', text: CORRECTION });
                }
            } else {
                sr.error(self, "no-correction", {text: CORRECTION});
            }
        } else {
            if (correctionSection) sr.error(self, "unnecessary-correction");
        }
        // check addition paragraph with green background
        if (recType.newFeatures) {
            if (additionSection) {
                if (sr.norm(additionSection.textContent) !== ADDITION) {
                    sr.error(self, 'wrong-text', { type: 'addition', text: ADDITION });
                }
            } else {
                sr.error(self, "no-addition");
            }
        } else {
            if(additionSection) sr.error(self, "unnecessary-addition", {text: ADDITION});
        }
    }
    return done();
};
