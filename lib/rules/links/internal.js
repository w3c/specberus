const self = {
    name: 'links.internal'
,   section: 'document-body'
,   rule: 'brokenLink'
};

exports.name = self.name;

exports.check = function (sr, done) {
    sr.jsDocument.querySelectorAll("a[href^='#']").forEach(function (element) {
        var id = element.getAttribute("href").replace("#", "")
        ,   escId = id.replace(/([.()#:[\]+*])/g, "\\$1")
        ;
        if (id === "") return;
        console.log('id: ',id, "   #" + escId + ", a[name='" + id + "']");
        if (!sr.jsDocument.querySelectorAll("#" + escId + ", a[name='" + id + "']").length) {
            sr.error(self, "anchor", { id: id });
        }
    });
    done();
};
