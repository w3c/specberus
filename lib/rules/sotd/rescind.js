// SotD
// <p>W3C has chosen to rescind the Sample Specification Recommendation for the
// following reasons: [...list of reasons...]. For additional information about
// replacement or alternative technologies, please refer to the <a
// href="https://www.w3.org/2016/11/obsoleting-rescinding/">explanation of
// Obsoleting and Rescinding W3C Specifications</a>.</p>

function findRscndRational ($candidates, sr) {
    var $rational = null;
    $candidates.each(function () {
        var $p = sr.$(this)
        ,   text = sr.norm($p.text())
        ,   wanted1 = new RegExp('W3C has chosen to rescind the .*? Recommendation for the following reasons:', 'i')
        ,   wanted2 = new RegExp('For additional information about replacement or alternative technologies,' +
                          ' please refer to the explanation of Obsoleting and Rescinding W3C Specifications.', 'i')
        ;
        if (wanted1.test(text) && wanted2.test(text)) {
            $rational = $p;
            return false;
        }
    });
    return $rational;
}

const self = {
        name: 'sotd.rescind'
    ,   section: 'document-status'
    ,   rule: 'rescindsRational'
};

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if ($sotd && $sotd.length) {
        var $rational = findRscndRational($sotd.filter("p"), sr) || findRscndRational($sotd.find("p"), sr);
        if (!$rational || !$rational.length) {
            sr.error(self, "no-rational");
        } else {
            var $a   = $rational.find("a:last-child")
            ,   href = $a.attr("href")
            ,   text = sr.norm($a.text())
            ;
            if (href !== "https://www.w3.org/2016/11/obsoleting-rescinding/" ||
                text !== "explanation of Obsoleting and Rescinding W3C Specifications") {
                  sr.error(self, "no-explanation-link");
            }
        }

    }
    done();
};
