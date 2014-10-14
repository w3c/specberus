
'use strict';

exports.name  = 'sotd.implementation';

exports.check = function (sr, done) {

    var LINK_PATTERN      = /(implementation|interoperability)\s+report$/i;
    var STATEMENT_PATTERN = /.{40}(implementation|interoperability)\s+report.{40}/ig;

    var sotd;
    var text;
    var url_candidates = {};
    var item;
    var found = false;
    var match;

    sr.$('a').each(function (foo, element) {
      item = sr.$(element);

      if (LINK_PATTERN.exec(item.text())) {
        url_candidates[item.attr('href')] = item.text();
      }

    });

    if (Object.keys(url_candidates).length > 0) {

      for (item in url_candidates) {
        sr.info(exports.name, 'candidate', {text: url_candidates[item], url: item});
      }

    }
    else {
      sotd = sr.getSotDSection();

      if (!sotd) {
        sr.error(exports.name, 'unknown');
      }
      else {
        text = sotd.text().replace(/\n+/g, ' ');

        while (match = STATEMENT_PATTERN.exec(text)) {
          found = true;
          sr.info(exports.name, 'no-report', {text: match[0]});
        }

        if (!found) {
          sr.error(exports.name, 'unknown');
        }

      }

    }

    return done();

};

