
var groups = require("../../groups-db.json");

exports.name = "sotd.group-name";
exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }
    var ml;
    $sotd.find("a[href]").each(function () {
        var href = sr.$(this).attr("href");
        if (/^mailto:.+@w3\.org(?:\?subject=.*)?$/.test(href) && !/.+-request@/.test(href)) {
            ml = href.replace("mailto:", "").replace(/\?subject=.*/i, "");
            return false;
        }
    });
    if (!ml) {
        sr.warning(exports.name, "no-ml");
    }
    else {
        var info = groups[ml];
        if (!info) {
            sr.warning(exports.name, "no-group");
        }
        else {
            var $lnk = $sotd.find("a[href='" + info.url + "']").first();
            if (!$lnk.length) {
                sr.error(exports.name, "no-link", info);
            }
            else {
                var altName = info.name.replace("Working Group", "WG")
                                       .replace("Interest Group", "IG")
                                       .replace("Coordination Group", "CG")
                ,   txt = $lnk.text()
                ;
                if (txt !== info.name && txt !== altName) sr.error(exports.name, "no-name", info);
            }
        }
    }

    done();
};
