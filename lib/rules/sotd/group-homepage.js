
var sua = require("../../throttled-ua");

exports.name = "sotd.group-homepage";
exports.check = function (sr, done) {

    var deliverers = sr.getDelivererIDs()
    ,   ua         = "Specberus/" + sr.version
    ,   $sotd      = sr.getSotDSection()
    ,   count      = 0
    ,   apikey     = process.env.API_KEY
    ;

    if (deliverers.length === 0) {
        sr.error(exports.name, "no-group");
        return done();
    }
    if (!apikey) {
        sr.warning(exports.name, "no-key");
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
              sr.warning(exports.name, "no-response", {status: res.status});
          } else {
              var homepage = res.body._links.homepage.href
                  found = false;

              $sotd.find("a[href]").each(function () {
                  var href = sr.$(this).attr("href");
                  if (href === homepage) {
                      found = true;
                      return false;
                  }
              });
              if (!found) {
                  sr.warning(exports.name, "no-homepage", { homepage: homepage });
              }
          }
          count++;
          if (count === deliverers.length) {
              done();
          }
        });
    }
};
