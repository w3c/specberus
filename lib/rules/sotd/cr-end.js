const self = {
    name: 'sotd.cr-end'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var isEditorial = (sr.config.editorial && /^true$/i.test(sr.config.editorial)) || false;
    if (isEditorial) {
        sr.warning(self, "editorial");
    }
    else {
        const dates = sr.getFeedbackDueDate();
        if (0 === dates.list.length)
            sr.error(self, "not-found");
        else {
            var res;

            if (1 === dates.valid.length) {
                res = dates.valid[0];
                sr.info(self, "date-found", {date: res.toDateString()});
            }
            else if (dates.valid.length > 1) {
                sr.warning(self, "multiple-found");
                res = new Date(Math.min.apply(null, dates.valid));
                sr.info(self, "date-found", {date: res.toDateString()});
            } else {
                // dates found but not valid
                res = new Date(Math.min.apply(null, dates.list));
                sr.error(self, "found-not-valid", {date: res.toDateString()});
            }
        }
    }
    done();
};
