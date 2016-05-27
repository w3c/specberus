var sua = require("../../throttled-ua");

const self = {
    name: 'sotd.group-homepage'
,   section: 'document-status'
,   rule: 'WGLinkTest'
};

exports.check = function (sr, done) {

    var deliverers = sr.getDelivererIDs()
    ,   ua         = "Specberus/" + sr.version
    ,   $sotd      = sr.getSotDSection()
    ,   count      = 0
    ,   apikey     = process.env.API_KEY
    ;

    if (deliverers.length === 0) {
        sr.error(self, "no-group");
        return done();
    }
    if (!apikey) {
        // Omitting 'section' & 'rule' on purpose: the error is not about the rule, but about local config.
        sr.warning({name: self.name}, "no-key");
        return done();
    }
    for (var i = 0; i < deliverers.length; i++) {
        var req,
            url = 'https://api.w3.org/groups/'+deliverers[i]
        ;
        req = sua.get(url)
                 .set("User-Agent", ua);
        req.query({apikey: apikey});
        req.end(function(err, res) {
          if (err || !res.ok) {
              sr.warning(self, "no-response", {status: res.status});
          } else {
              var homepage = res.body._links.homepage.href;
              found = false;
              $sotd.find("a[href]").each(function () {
                  var href = sr.$(this).attr("href");
                  if (href === homepage) {
                      found = true;
                      return false;
                  }
              });
              if (!found) {
                  sr.warning(self, "no-homepage", { homepage: homepage });
              }
          }
          count++;
          if (count === deliverers.length) {
              done();
          }
        });
    }
};
