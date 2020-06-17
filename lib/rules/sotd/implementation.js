const self = {
    name: 'sotd.implementation'
};

exports.name = self.name;

exports.check = function (sr, done) {

    var LINK_PATTERN = /(implementation|interoperability)\s+report$/i;

    var url_candidates = {};
    var item;
    var sotd = sr.getSotDSection();
    if (sotd) {
        sotd.querySelectorAll("a").forEach(function (item) {
          if (LINK_PATTERN.exec(item.textContent)) {
            url_candidates[item.getAttribute('href')] = item.textContent;
          }

        });

        if (Object.keys(url_candidates).length > 0) {

          for (item in url_candidates) {
            sr.info(self, 'candidate', {text: url_candidates[item], url: item});
          }

        }
        else {

          var STATEMENT_PATTERN = /.{40}(implementation|interoperability)\s+report.{40}/ig;

          var text = sotd && sotd.textContent.replace(/\n+/g, ' ');
          var found = false;
          var match;

          while (null !== (match = STATEMENT_PATTERN.exec(text))) {
            found = true;
            sr.info(self, 'no-report', {text: match[0]});
          }

          if (!found) {
            sr.error(self, 'unknown');
          }

        }
    }

    return done();

};
