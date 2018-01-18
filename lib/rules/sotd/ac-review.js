const self = {
    name: 'sotd.ac-review'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if ($sotd && $sotd.length) {
        var found = false;
        $sotd.find("a[href*='www.w3.org/2002/09/wbs/']").each(function() {
            var href = sr.$(this).attr("href");
            found = true;
            // XXX use an <a href> to display the link
            sr.info(self, "found", { link : href });
            return;
        });
        if (!found) sr.error(self, "not-found");
    }
    done();
};
