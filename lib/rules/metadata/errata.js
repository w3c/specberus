/**
 * Pseudo-rule for metadata extraction: errata.
 */

// 'self.name' would be 'metadata.errata'

exports.name = 'metadata.errata';

exports.check = function (sr, done) {
    const errataRegex = /errata/i;
    const linkElement = sr.jsDocument.querySelectorAll(
        'body div.head dl + p > a'
    );
    const errata = Array.prototype.filter.call(linkElement, element =>
        errataRegex.test(element.textContent)
    );
    if (!errata.length || !errata[0].getAttribute('href')) done();
    else done({ errata: errata[0].getAttribute('href') });
};
