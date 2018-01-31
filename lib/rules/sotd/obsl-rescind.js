// SotD
// <p>W3C has chosen to (rescind|obsolete|supersede) the Sample Specification Recommendation for the
// following reasons: [...list of reasons...]. For additional information about
// replacement or alternative technologies, please refer to the <a
// href="https://www.w3.org/2016/11/obsoleting-rescinding/">explanation of
// Obsoleting and Rescinding W3C Specifications</a>.</p>

function findRscndRationale ($candidates, sr) {
    var $rationale = null
    ,   v;
    if (sr.config.rescinds === true) v = "rescind";
    else if (sr.config.obsoletes === true) v = "obsolete";
    else if (sr.config.supersedes === true) v = "supersede";

    $candidates.each(function () {
        var $p = sr.$(this)
        ,   text = sr.norm($p.text())
        ,   wanted1 = new RegExp('W3C has chosen to ' + v + ' the .*? Recommendation for the following reasons:', 'i')
        ,   wanted2 = new RegExp('For additional information about replacement or alternative technologies,' +
                          ' please refer to the explanation of Obsoleting, Rescinding or Superseding W3C Specifications.', 'i')
        ;
        if (wanted1.test(text) && wanted2.test(text)) {
            $rationale = $p;
            return false;
        }
    });
    return $rationale;
}

const self = {
        name: 'sotd.obsl-rescind'
    ,   section: 'document-status'
    ,   rule: 'rescindsRationale'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if ($sotd && $sotd.length) {
        var $rationale = findRscndRationale($sotd.filter("p"), sr) || findRscndRationale($sotd.find("p"), sr);
        if (!$rationale || !$rationale.length) {
            sr.error(self, "no-rationale");
        } else {
            var $a   = $rationale.find("a:last-child")
            ,   href = $a.attr("href")
            ,   text = sr.norm($a.text())
            ;
            if (href !== "https://www.w3.org/2016/11/obsoleting-rescinding/" ||
                text !== "explanation of Obsoleting, Rescinding or Superseding W3C Specifications") {
                  sr.error(self, "no-explanation-link");
            }
        }
    }
    done();
};
