const self = {
    name: 'echidna.todays-date',
    section: 'front-matter',
    // @TODO: update this selector... when the rule is added to the JSON.
    rule: 'dateState',
};

exports.name = self.name;

exports.check = function (sr, done) {
    /**
     * Get the timestamp of a day, regardless the time of the day.
     * This function creates a new `Date` to avoid modifying the original one.
     *
     * @param {Date} date - The date to extract the day, month and year from
     * @returns {number} number of milliseconds between 1 January 1970 and `date`
     */
    function getDateTime(date) {
        return new Date(date.getTime()).setHours(0, 0, 0, 0);
    }

    if (!(sr.getDocumentDate() instanceof Date)) {
        sr.error(self, 'date-not-detected');
    } else if (getDateTime(sr.getDocumentDate()) !== getDateTime(new Date())) {
        sr.error(self, 'wrong-date');
    }

    done();
};
