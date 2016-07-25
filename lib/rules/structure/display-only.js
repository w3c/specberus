const name = 'structure.display-only';

exports.check = function (sr, done) {

    sr.info({name: name, section: 'document-status', rule: 'customParagraph'}, 'customised-paragraph');
    sr.info({name: name, section: 'document-status', rule: 'knownDisclosureNumber'}, 'known-disclosures');
    sr.info({name: name}, 'normative-representation');
    sr.info({name: name}, 'visual-style');
    sr.info({name: name}, 'alt-representation');
    sr.info({name: name}, 'special-box-markup');
    sr.info({name: name}, 'index-list-tables');
    sr.info({name: name}, 'fit-in-a4');
    done();

};
