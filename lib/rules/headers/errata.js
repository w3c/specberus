// errata, right after dl

const self = {
    name: 'headers.errata'
    // @TODO: find out rule?
};

exports.name = self.name;

exports.check = function (sr, done) {
    var errataRegex = /errata/i
        , errata = Array.prototype.filter.call(sr.jsDocument.querySelectorAll("body div.head dl + p > a"), element => errataRegex.test(element.textContent))
        ;

    if (!errata.length || !errata[0].getAttribute("href"))
        sr.error(self, "not-found");
    else if (!errata[0].getAttribute("href").trim().toLowerCase().startsWith('https://'))
        sr.error(self, "link-should-be-https", {link: errata[0].getAttribute("href")});
    done();
};
