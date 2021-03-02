const self = {
    name: 'heuristic.date-format',
    section: 'document-status',
    rule: 'datesFormat',
};

exports.name = self.name;

exports.check = function (sr, done) {
    // Pseudo-constants:
    const MONTHS =
        'jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december';
    const POSSIBLE_DATE = new RegExp(
        `\\b([0123]?\\d|${MONTHS})[\\ \\-\\/–—]([0123]?\\d|${MONTHS})[\\ \\-\\/–—]([\\'‘’]?\\d{2})(\\d\\d)?\\b`,
        'gi'
    );
    const EXPECTED_DATE_FORMAT = new RegExp(
        `[0123]?\\d\\ (${MONTHS})\\ \\d{4}`,
        'i'
    );

    const boilerplateSections = [
        sr.jsDocument.querySelector('div.head'),
        sr.getSotDSection(),
    ];
    const candidateDates = [];
    let i;
    let j;
    let elem;

    for (i in boilerplateSections) {
        const text =
            boilerplateSections[i] && boilerplateSections[i].textContent;
        elem =
            text &&
            text.replace(/(?:https?|ftp):\/\/\S+/gi, '').match(POSSIBLE_DATE);
        for (j in elem) {
            candidateDates.push(elem[j]);
        }
    }

    for (i in candidateDates) {
        if (!candidateDates[i].match(EXPECTED_DATE_FORMAT)) {
            sr.error(self, 'wrong', { text: candidateDates[i] });
        }
    }

    return done();
};
