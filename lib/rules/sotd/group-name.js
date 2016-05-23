var groups = require("../../groups-db.json");

const self = {
    name: 'sotd.group-name'
};

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(self, "no-sotd");
        return done();
    }
    var ml;
    $sotd.find("a[href]").each(function () {
        var href = sr.$(this).attr("href");
        if (/^mailto:.+@w3\.org(?:\?subject=.*)?$/i.test(href) && !/.+-request@/.test(href)) {
            ml = href.replace("mailto:", "").replace(/\?subject=.*/i, "");
            return false;
        }
    });
    if (!ml) {
        sr.warning(self, "no-ml");
    }
    else {
        var info =  groups[ml] ||
                    groups[ml.replace("-comments", "")] ||
                    groups[ml.replace("-comments", "-wg")];
        if (!info) {
            sr.warning(self, "no-group");
        }
        else {
            var $lnk = $sotd.find("a[href='" + info.url + "']").first();
            if (!$lnk.length) {
                sr.error(self, "no-link", info);
            }
            else {
                var altName = info.name.replace("Working Group", "WG")
                                       .replace("Interest Group", "IG")
                                       .replace("Coordination Group", "CG")
                ,   txt = sr.norm($lnk.text())
                ;
                if (txt !== info.name && txt !== altName) sr.error(self, "no-name", info);
            }
        }
    }

    done();
};
