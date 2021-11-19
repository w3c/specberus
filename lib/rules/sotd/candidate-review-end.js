const self = {
    name: 'sotd.candidate-review-end',
    section: 'document-status',
    rule: 'reviewEndDate',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const isEditorial =
        (sr.config.editorial && /^true$/i.test(sr.config.editorial)) || false;
    if (isEditorial) {
        sr.warning(self, 'editorial');
    } else {
        const dates = sr.getFeedbackDueDate();
        if (dates.list.length === 0) sr.error(self, 'not-found');
        else {
            let res;

            if (dates.valid.length === 1) {
                [res] = dates.valid;
                sr.info(self, 'date-found', { date: res.toDateString() });
            } else if (dates.valid.length > 1) {
                sr.warning(self, 'multiple-found');
                res = dates.valid.map(item => new Date(item).toDateString());
                sr.info(self, 'date-found', { date: res.join(', ') });
            } else {
                // dates found but not valid
                res = dates.list.map(item => new Date(item).toDateString());
                sr.error(self, 'found-not-valid', { date: res.join(', ') });
            }
        }
    }
    done();
};
