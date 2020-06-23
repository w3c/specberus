const self = {
    name: 'sotd.team-subm-link'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    if (sotd) {
        var a = sotd.querySelectorAll("a[href='http://www.w3.org/TeamSubmission/']");
        if (!a.length) sr.error(self, "no-link");
    }
    done();
};
