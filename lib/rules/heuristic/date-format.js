const self = {
    name: 'heuristic.date-format'
,   section: 'document-status'
,   rule: 'datesFormat'
};

exports.name = self.name;

exports.check = function (sr, done) {

    // Pseudo-constants:
    var MONTHS = 'jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december'
    ,   POSSIBLE_DATE = new RegExp('([0123]?\\d|' + MONTHS + ')[\\ \\-\\/–—]([0123]?\\d|' + MONTHS + ')[\\ \\-\\/–—]([\\\'‘’]?\\d{2})(\\d\\d)?', 'gi')
    ,   EXPECTED_DATE_FORMAT = new RegExp('[0123]?\\d\\ (' + MONTHS + ')\\ \\d{4}', 'i');

    var boilerplateSections = [
            sr.jsDocument.querySelectorAll('div.head')
        ,   sr.getSotDSection()
        ]
    ,   candidateDates = []
    ,   i
    ,   j
    ,   elem;

    for (i in boilerplateSections) {
        elem = boilerplateSections[i].textContent.replace(/(?:https?|ftp):\/\/\S+/gi, '').match(POSSIBLE_DATE);
        for (j in elem) {
            candidateDates.push(elem[j]);
        }
    }

    for (i in candidateDates) {
        if (!candidateDates[i].match(EXPECTED_DATE_FORMAT)) {
            sr.error(self, 'wrong', {text: candidateDates[i]});
        }
    }

    return done();

};
