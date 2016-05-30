const self = {
    name: 'sotd.cr-end'
};

exports.check = function (sr, done) {
    const dates = sr.getFeedbackDueDate();
    if (0 === dates.length)
        sr.error(self, "not-found");
    else {
        var res;
        if (1 === dates.length)
            res = dates[0];
        else {
            sr.warning(self, "multiple-found");
            res = new Date(Math.min.apply(null, dates));
        }
        sr.info(self, "date-found", {date: res.toDateString()});
    }
    done();
};
