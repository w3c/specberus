const self = {
    name: 'structure.security-privacy'
,   section: 'document-body'
,   rule: 'securityAndPrivacy'
};

exports.check = function (sr, done) {
    var security = false;
    var privacy = false;

    sr.$("h2, h3, h4, h5, h6").each(function () {
        var text = sr.$(this).text().toLowerCase();

        if (text.includes("security")) {
            security = true;
        }
        if (text.includes("privacy")) {
            privacy = true;
        }
    });

    if (!security && !privacy) {
      sr.warning(self, "no-security-privacy");
    } else {
      if (!security)
        sr.warning(self, "no-security");

      if (!privacy)
        sr.warning(self, "no-privacy");
    }

    done();
};
