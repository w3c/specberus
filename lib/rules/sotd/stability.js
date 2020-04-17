// SotD
//  stability warning
// <p>Publication as a Working Draft does not imply endorsement by the W3C Membership. This is a
// draft document and may be updated, replaced or obsoleted by other documents at any time. It is
// inappropriate to cite this document as other than work in progress.</p>
function findSW ($candidates, sr) {
    var $sw = null;
    $candidates.each(function () {
        var $p = sr.$(this)
        , text = sr.norm($p.text())
        , article = (sr.config.longStatus == "Interest Group Note") ? "an" : "a"
        , wanted = "^Publication as " + article + " " + sr.config.longStatus +
                " does not imply endorsement " +
                "by the W3C Membership. This is a draft document and may be updated, " +
                "replaced or obsoleted by other documents at any time. "
        ;

        if (!sr.config.longStatus.match('Note$')) {
            wanted += "It is inappropriate to cite this document as other than work in progress.$";
        }

        if (text.match(wanted)) {
            $sw = $p;
            return false;
        }
    });
    return $sw;
}

const self = {
    name: 'sotd.stability'
};

exports.name = self.name;

exports.check = function (sr, done) {
    if (!sr.config.stabilityWarning) return done();
    var $sotd = sr.getSotDSection();
    if ($sotd && $sotd.length) {
        if (sr.config.stabilityWarning === "REC") {
            var txt = sr.norm($sotd.text())
            ,   wanted = "This document has been reviewed by W3C Members, by software developers, " +
                         "and by other W3C groups and interested parties, and is endorsed by the " +
                         "Director as a W3C Recommendation. It is a stable document and may be used " +
                         "as reference material or cited from another document. W3C's role in making " +
                         "the Recommendation is to draw attention to the specification and to " +
                         "promote its widespread deployment. This enhances the functionality and " +
                         "interoperability of the Web."
            ,   rex = new RegExp(wanted.replace(/\./g, "\\."))
            ;
            if (!rex.test(txt)) sr.error(self, "no-rec-review");
        }
        else {
            var $sw = findSW($sotd.filter("p"), sr) || findSW($sotd.find("p"), sr);
            if (!$sw || !$sw.length)
                sr.error(self, "no-stability");
        }
    }
    done();
};
