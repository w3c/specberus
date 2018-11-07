
var url = require("url")
,   sua = require("../../throttled-ua");

const self = {
    name: 'links.compound'
}
,   TIMEOUT = 10000;

exports.name = self.name;

exports.check = function (sr, done) {
    if (sr.config.validation !== "recursive") {
        sr.warning(self, "skipped");
        return done();
    }
    var links = [];
    if ( typeof String.prototype.startsWith != 'function' ) {
        String.prototype.startsWith = function( str ) {
            return this.substring( 0, str.length ) === str;
        };
    }

    if(sr.url) {
        sr.$('a[href]').each(function () {
            var u = new url.URL(sr.$(this).attr("href"), sr.url)
            ,   l = u.origin + u.pathname;
            if (l.startsWith(sr.url) && l != sr.url) links.push(l);
        });
    }
    // sort and remove duplicates
    links = links.sort().filter(function (item, pos) {return (!pos || item != links[pos - 1]);});

    var markupService = "https://validator.w3.org/nu/"
    ,   cssService = "http://jigsaw.w3.org/css-validator/validator"
    ,   count = 0;
    if (links.length > 0) {
      links.forEach(function (l) {
          if (sr.config.validation === "recursive") {
              var req
              ,   reqCSS
              ,   ua = "W3C-Pubrules/" + sr.version
              ,   isMarkupValid = false
              ,   isCSSValid = false;
              req = sua.get(markupService)
                       .set("User-Agent", ua)
                       .query({ doc: l, out: "json" })
                       .on('error', function(err) {
                           sr.error(self, 'error', { file : l.split('/').pop(), link : l, errMsg: err});
                           count++;
                           return;
                       });
              req.timeout(TIMEOUT);
              req.end(function (err1, res) {
                  if (err1 && err1.timeout === TIMEOUT) sr.warning(self, "html-timeout");
                  var json = res ? res.body : null;
                  if (!json) return sr.throw("No JSON input.");
                  if (json.messages) {
                      var errors = json.messages.filter(function(msg) {
                          return msg.type === "error";
                      });
                      if (errors.length === 0) isMarkupValid = true;
                  }
                  reqCSS = sua.get(cssService)
                          .set("User-Agent", ua)
                          .query({ uri: l, profile: "css3svg", output: "json", type: "html" })
                          .on('error', function(err) {
                              sr.error(self, 'error', { file : l.split('/').pop(), link : l, errMsg: err});
                              count++;
                              return;
                          });
                  reqCSS.timeout(TIMEOUT);
                  reqCSS.end(function (err2, res) {
                      if (err2 && err2.timeout === TIMEOUT) sr.warning(self, "css-timeout");
                      if (res && res.header && res.header['x-w3c-validator-status'] === 'Valid') isCSSValid = true;
                      if (isMarkupValid && isCSSValid) {
                          sr.info(self, "link", { file : l.split('/').pop(), link : l , markup : "\u2714", css : "\u2714" });
                      }
                      else {
                          const details = {
                              file: l.split('/').pop(),
                              link: l,
                              markup: (isMarkupValid ? "\u2714" : "\u2718"),
                              css: (isCSSValid ? "\u2714" : "\u2718")
                          };
                          sr.error(self, "link", details);
                      }
                      count++;
                      if (count === links.length) return done();
                  });
              });
          }
          else {
              sr.info(self, "no-validation", { file : l.split('/').pop(), link : l });
          }
      });
    } else return done();
};
