
exports.name = "links.internal";
exports.check = function (sr, done) {
    sr.$("a[href^=#]").each(function () {
        var id = sr.$(this).attr("href").replace("#", "")
        ,   escId = id.replace(/\./g, "\\.")
        ;
        if (!sr.$("#" + escId + ", a[name='" + id + "']").length) {
            sr.sink.emit("err", exports.name, { message: "Link to missing anchor: '" + id + "'" });
        }
    });
    done();
};
