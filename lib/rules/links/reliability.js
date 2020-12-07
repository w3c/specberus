const self = {
    name: 'links.reliability'
,   section: 'document-body'
};

exports.name = self.name;
const unreliableDomains = ['w3c-test.org', 'www.w3c-test.org', 'dev.w3.org', 'dvcs.w3.org'];
const unreliableServices = [{ domain: 'w3.org', path: 'Bugs' }];

exports.check = function (sr, done) {
    sr.jsDocument.querySelectorAll("a").every(function (element) {
        var url;
        try {
            url = new URL(element.href, sr.url || undefined);
        }
        catch (e) {
            done();
        }

        const domain = url && url.hostname;
        if (domain) {
            if (unreliableDomains.includes(domain)) {
                const text = sr.norm(element.textContent);
                sr.warning(self, "unreliable-link", { link: domain, text: text });
                return true;
            }
            var path = url.pathname;
            if (path && path !== '/') {
                unreliableServices.filter(unreliableService => {
                    if (unreliableService.domain === domain && path.match(new RegExp('^' + unreliableService.path)))
                        sr.warning(self, "unreliable-link", {
                            link: url,
                            text: sr.norm(element.textContent)
                        });
                });
            }
            return true;
        }
    });
    done();
};
