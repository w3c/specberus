
exports.name = "links.internal";
exports.check = function (sr, done) {
    sr.$("a[href^=#]").each(function () {
        var id = sr.$(this).attr("href").replace("#", "")
        ,   escId = id.replace(/([\.\(\)\#\:\[\]\+\*])/g, "\\$1")
        ;
        if (id === "") return;
        if (!sr.$("#" + escId + ", a[name='" + id + "']").length) {
            sr.error(exports.name, "anchor", { id: id });
        }
    });
    done();
};
