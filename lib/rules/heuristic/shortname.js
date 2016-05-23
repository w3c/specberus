const self = {
    name: 'heuristic.shortname'
,   section: 'front-matter'
,   rule: 'docIDLatestVersion'
};

exports.check = function (sr, done) {
    var $dl = sr.$("body div.head dl").first()
    ,   latestURI = ''
    ,   subType = sr.config.submissionType
    ,   topLevel = "TR"
    ;

    if (subType === "member") topLevel = "Submission";
    else if (subType === "team") topLevel = "TeamSubmission";

    var extractLatestURI = function (dl) {
      var latestAnchor;
      dl.find("dt").each(function (idx) {
        var $dt = sr.$(this)
        ,   txt = sr.norm($dt.text())
                      .replace(":", "")
                      .toLowerCase()
                      .replace("published ", "")
        ,   $dd = $dt.next('dd')
        ;
        if (txt.lastIndexOf("latest version", 0) === 0) latestAnchor = $dd.find("a").first();
      });
      return latestAnchor;
    };

    var $linkLate = extractLatestURI($dl);
    if ($linkLate && $linkLate.length && $linkLate.attr("href") !== "") {
      var lateRex = "^https?:\\/\\/www\\.w3\\.org\\/" + topLevel + "\\/(.+?)\\/?$"
          ,   matches = ($linkLate.attr("href") || "").trim().match(new RegExp(lateRex));
          if (matches) {
             var sn = matches[1];
             latestURI = $linkLate.text();
             sr.metadata('shortname', sn);
         }
    }
    else
      sr.error(self, 'latest-link');

    return done();

};
