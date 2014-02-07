
// SotD
//  stability warning
// <p>Publication as a Working Draft does not imply endorsement by the W3C Membership. This is a
// draft document and may be updated, replaced or obsoleted by other documents at any time. It is
// inappropriate to cite this document as other than work in progress.</p>

function findSW ($candidates, sr) {
    var $sw = null;
    $candidates.each(function () {
        var $p = sr.$(this)
        ,   text = sr.norm($p.text())
        ,   wanted = "Publication as a " + sr.config.longStatus + " does not imply endorsement " +
                     "by the W3C Membership. This is a draft document and may be updated, " +
                     "replaced or obsoleted by other documents at any time. It is inappropriate " +
                     "to cite this document as other than work in progress."
        ;
        if (text === wanted) {
            $sw = $p;
            return false;
        }
    });
    return $sw;
}

exports.name = "sotd.stability";
exports.check = function (sr, done) {
    if (!sr.config.stabilityWarning) return done();
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }
    
    var $sw = findSW($sotd.filter("p"), sr) || findSW($sotd.find("p"), sr);
    if (!$sw || !$sw.length)
        sr.error(exports.name, "no-stability");
    done();
};
