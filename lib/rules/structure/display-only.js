const name = 'structure.display-only';

exports.check = function (sr, done) {

    sr.info({name: name, section: 'document-body', rule: 'brokenLinkTest'}, 'broken-links');
    sr.info({name: name, section: 'document-status', rule: 'customParagraphTest'}, 'customised-paragraph');
    sr.info({name: name, section: 'document-status', rule: 'knownDisclosureNumberTest'}, 'known-disclosures');
    // @TODO: remove this informative message from the UI, since it's always shown here anyway?
    sr.info(exports.name, 'normative-representation');
    sr.info(exports.name, 'visual-style');
    sr.info(exports.name, 'alt-representation');
    sr.info({name: name}, 'old-pubrules');
    sr.info({name: name}, 'special-box-markup');
    sr.info({name: name}, 'index-list-tables');
    sr.info({name: name}, 'fit-in-a4');
    done();

};
