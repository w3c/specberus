
// section IDs
// "Every marked-up section and subsection of the document MUST have a target anchor. A section is
// identified by a heading element (h1-h6). The anchor may be specified using an id (or name if an a
// element is used) attribute on any of the following: the heading element itself, the parent div or
// section element of the heading element (where the heading element is the first child of the div or
// section), a descendant of the heading element, or an a immediately preceding the heading element."


exports.name = "structure.section-ids";
exports.check = function (sr, done) {
    sr.$("h1, h2, h3, h4, h5, h6").each(function () {
        var $h = sr.$(this);
        
        if ($h.attr("id")) return;
        // XXX more
        
        sr.sink.emit("err", exports.name, { message: "No ID for section: " + $h.text() });
    });
    done();
};
