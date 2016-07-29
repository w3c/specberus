const self = {
    name: 'sotd.team-subm-link'
};

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if ($sotd && $sotd.length) {
        var $a = $sotd.find("a[href='http://www.w3.org/TeamSubmission/']");
        if (!$a.length) sr.error(self, "no-link");
    }
    done();
};
