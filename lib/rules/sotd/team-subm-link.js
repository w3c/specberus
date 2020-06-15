const self = {
    name: 'sotd.team-subm-link'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    if (sotd && sotd.list.length) {
        var a = sotd.element.querySelectorAll("a[href='http://www.w3.org/TeamSubmission/']");
        if (!a.length) sr.error(self, "no-link");
    }
    done();
};
