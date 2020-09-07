/**
 * Pseudo-rule for metadata extraction: patent-policy.
 */

// 'self.name' would be 'metadata.patent-policy'

const w3capi = require('node-w3capi');

exports.name = "metadata.patent-policy";

exports.check = function(sr, done) {

    const deliverers = sr.getDelivererIDs()
    ,     docDate = sr.getDocumentDate();

    if (deliverers.length) {
        w3capi.apiKey = process.env.W3C_API_KEY;
        w3capi.group(deliverers[0]).charters().fetch({ embed: true }, (err, charters) => {
          if (err) {
              return done();
          } else {
              let patentPolicy;
              charters.forEach (c => {
                  if (docDate >= new Date(c.start) && docDate <= new Date(c.end)) {
                      patentPolicy = c["patent-policy"];
                  }
              });
              return done({patentPolicy: patentPolicy});
          }
        });
    }
};
