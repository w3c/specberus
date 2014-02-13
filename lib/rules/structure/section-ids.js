
// section IDs
// "Every marked-up section and subsection of the document MUST have a target anchor. A section is
// identified by a heading element (h1-h6). The anchor may be specified using an id (or name if an a
// element is used) attribute on any of the following: the heading element itself, the parent div or
// section element of the heading element (where the heading element is the first child of the div or
// section), a descendant of the heading element, or an a immediately preceding the heading element."


exports.name = "structure.section-ids";
exports.check = function (sr, done) {
    sr.$("h2, h3, h4, h5, h6").each(function () {
        var $h = sr.$(this);
        
        // has an id
        if ($h.attr("id")) return;

        // has no element previous sibling, has parent div or section, and that has an id
        //  without prevAll that sucks... get children of parent and find self
        var $parent = $h.parent()
        ,   $sibs = $parent.children()
        ;
        if ($sibs[0] === $h[0] && ($parent.is("section") || $parent.is("div")) && $parent.attr("id"))
            return;

        // has a descendant that has an id
        if ($h.find("*[id]").length) return;
        
        // has an a[name] descendant
        if ($h.find("a[name]").length) return;
        
        // has a[name] as previous element sibling
        for (var i = 1, n = $sibs.length; i < n; i++) {
            if ($sibs[i] === $h[0] && sr.$($sibs[i - 1]).is("a[name]")) return;
        }
        
        // this is the status h2
        if ($h[0] === sr.getDocumentDateElement()[0]) return;
        
        sr.error(exports.name, "no-id", { text: $h.text() });
    });
    done();
};
