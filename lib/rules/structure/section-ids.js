const self = {
    name: 'structure.section-ids'
,   section: 'document-body'
,   rule: 'headingWithoutID'
};

exports.name = self.name;

exports.check = function (sr, done) {
    sr.jsDocument.querySelectorAll("h2, h3, h4, h5, h6").forEach(function (h) {

        // has an id
        if (h.getAttribute("id")) return;

        // has no element previous sibling, has parent div or section, and that has an id
        //  without prevAll that sucks... get children of parent and find self
        var parent = h.parentElement
        ,   sibs = parent.children
        ;
        if (sibs[0] === h[0] && (parent.is("section") || parent.is("div")) && parent.getAttribute("id"))
            return;

        // has a descendant that has an id
        if (h.querySelectorAll("*[id]").length) return;

        // has an a[name] descendant
        if (h.querySelectorAll("a[name]").length) return;

        // has a[name] as previous element sibling
        for (var i = 1, n = sibs.length; i < n; i++) {
            if (sibs[i] === h[0] && sr.jsDocument.querySelectorAll(sibs[i - 1]).is("a[name]")) return;
        }

        // this is the status h2
        var dde = sr.getDocumentDateElement();
        if (dde && h[0] === dde[0]) return;

        sr.error(self, "no-id", { text: h.textContent });
    });
    done();
};
