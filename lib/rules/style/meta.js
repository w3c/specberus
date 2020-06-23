/**
* Check the presence of this <code>meta</code> tag in the head of the page:
* <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"&gt;</code>
*/

const self = {
  name: 'style.meta'
};

exports.name = self.name;

var mvp = require('metaviewport-parser');

var width = /^device-width$/i
,   shrinkToFit = /^no$/i
;

exports.check = function (sr, done) {
  var meta = sr.jsDocument.querySelectorAll("head > meta[name='viewport'][content]");
  if (!meta || 1 !== meta.length) {
    sr.error(self, "not-found");
  }
  else {
    var props = mvp.parseMetaViewPortContent(meta[0].getAttribute('content'));
    if (!props ||
      0 !== Object.keys(props.invalidValues).length ||
      3 !== Object.keys(props.validProperties).length ||
      !props.validProperties.width ||
      !width.test(props.validProperties.width) ||
      !props.validProperties['initial-scale'] ||
      1 !== props.validProperties['initial-scale'] ||
      !props.validProperties['shrink-to-fit'] ||
      !shrinkToFit.test(props.validProperties['shrink-to-fit']) ||
      0 !== Object.keys(props.unknownProperties).length) {
        sr.error(self, "not-found");
      }
    }
    done();
  };
