const rule = 'structure.display-only';

exports.name = rule;

exports.check = function (sr, done) {

    sr.info({name: rule, section: 'document-status', rule: 'customParagraph'}, 'customised-paragraph');
    sr.info({name: rule, section: 'document-status', rule: 'knownDisclosureNumber'}, 'known-disclosures');
    sr.info({name: rule}, 'normative-representation');
    sr.info({name: rule}, 'visual-style');
    sr.info({name: rule}, 'alt-representation');
    sr.info({name: rule}, 'special-box-markup');
    sr.info({name: rule}, 'index-list-tables');
    sr.info({name: rule}, 'fit-in-a4');
    done();

};
