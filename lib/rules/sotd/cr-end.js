const self = {
    name: 'sotd.cr-end'
};

exports.check = function (sr, done) {
    var dates = sr.getFeedbackDueDate()
    ,   res   = dates[0]
    ;
    if (dates.length === 0) sr.error(self, "not-found");
    if (dates.length > 1) {
      res = new Date(Math.min.apply(null,dates));
      sr.warning(self, "multiple-found");
    }
    sr.info(self, "date-found", {date: res.toDateString()});
    done();
};
