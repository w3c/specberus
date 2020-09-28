const self = {
    name: 'links.reliability'
,   section: 'document-body'
};

exports.name = self.name;
const unreliableDomains = ['w3c-test.org', 'www.w3c-test.org'];

exports.check = function (sr, done) {
    sr.jsDocument.querySelectorAll("a").forEach(function (element) {
        const url = new URL(element.href);
        const domain = url.hostname;
        if (domain) {
            if (unreliableDomains.includes(domain)) {
                const text= sr.norm(element.textContent);
                sr.warning(self, "unreliable-link", { link: domain, text: text });
            }
        }
    });
    done();
};
