const self = {
    name: 'links.internal'
,   section: 'document-body'
,   rule: 'brokenLinkTest'
};

exports.check = function (sr, done) {
    sr.$("a[href^=#]").each(function () {
        var id = sr.$(this).attr("href").replace("#", "")
        ,   escId = id.replace(/([\.\(\)\#\:\[\]\+\*])/g, "\\$1")
        ;
        if (id === "") return;
        if (!sr.$("#" + escId + ", a[name='" + id + "']").length) {
            sr.error(self, "anchor", { id: id });
        }
    });
    done();
};
