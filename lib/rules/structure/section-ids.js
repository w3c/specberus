const self = {
    name: 'structure.section-ids'
,   section: 'document-body'
,   rule: 'headingWithoutID'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var headers = sr.jsDocument.querySelectorAll("h2, h3, h4, h5, h6");
    var ignoreH3 = sr.jsDocument.querySelector(".head>h1+h2+h3");
    
    Array.prototype.every.call(headers, h => {
        // has an id
        if (h.getAttribute("id") || h === ignoreH3) return true;

        // has no element previous sibling, has parent div or section, and that has an id
        //  without prevAll that sucks... get children of parent and find self
        var parent = h.parentElement
        ,   sibs = parent.children
        ;

        if (sibs[0] === h && (parent.matches("section") || parent.matches("div")) && parent.getAttribute("id")) 
            return true;
        // has a descendant that has an id
        if (h.querySelectorAll("*[id]").length) return true;

        // has an a[name] descendant
        if (h.querySelectorAll("a[name]").length) return true;

        // has a[name] as previous element sibling
        for (var i = 1, n = sibs.length; i < n; i++) {
            if (sibs[i] === h && sibs[i - 1].matches("a[name]")) return true;
        }

        // this is the status h2
        var dde = sr.getDocumentDateElement();
        if (dde && h === dde) return true;

        sr.error(self, "no-id", { text: h.nodeName });
        return true;
    });
    done();
};
