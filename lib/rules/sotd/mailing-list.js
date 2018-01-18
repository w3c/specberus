// SotD
//  must include a public archived place to send comments to.
//  below:

const self = {
    name: 'sotd.mailing-list'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if ($sotd && $sotd.length) {
        var foundML = false
        ,   foundSub = false
        ,   foundArch = false
        ,   foundRepo = false
        ;
        $sotd.find("a[href]").each(function () {
            var $a = sr.$(this)
            ,   href = $a.attr("href")
            ,   text = sr.norm($a.text())
            ;
            if (/^mailto:.+@w3\.org(?:\?subject=.*)?$/i.test(href) &&
                !/.+-request@/.test(href)) {
                foundML = true;
                return;
            }
            if (/^mailto:.+?-request@w3\.org\?subject=subscribe$/i.test(href) && text === "subscribe") {
                foundSub = true;
                return;
            }
            if (/^https?:\/\/lists\.w3\.org\/Archives\//.test(href) && /archive/i.test(text)) {
                foundArch = true;
                return;
            }
            if (/^https:\/\/github.com\/[\w-]+\/[\w-]+\/issues/.test(href)) {
                foundRepo = true;
                return;
            }
        });
        if (!foundRepo) {
            if (sr.config.status === "REC") {
                sr.error(self, "no-repo");
            } else {
                if (!foundML) sr.error(self, "no-list");
                if (!foundSub) sr.warning(self, "no-sub");
                if (!foundArch) sr.error(self, "no-arch");
            }
        }
    }
    done();
};
