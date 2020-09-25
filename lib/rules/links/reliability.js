const self = {
    name: 'links.reliability'
,   section: 'document-body'
};

exports.name = self.name;
const unreliableLinks = ['w3c-test.org'];

exports.check = function (sr, done) {
    sr.jsDocument.querySelectorAll("a").forEach(function (element) {
        var href = element.href;
        var splitLink = href.startsWith('http') && href.split('/');
        var domain = splitLink && splitLink[2];
        if (domain) {
            unreliableLinks.forEach(unreliableLink => {
                if (domain.match(unreliableLink + '$')) {
                    var text = sr.norm(element.textContent);
                    sr.warning(self, "unreliable-link", { link: unreliableLink, text: text });
                }
            });
        }
    });
    done();
};
