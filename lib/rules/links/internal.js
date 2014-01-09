
exports.check = function (sr, cb) {
    var name = "links.internal"
    ,   seenErrors = false
    ;

    sr.$("a[href^=#]").each(function () {
        var id = sr.$(this).attr("href").replace("#", "")
        ,   escId = id.replace(/\./g, "\\.")
        ;
        if (!sr.$("#" + escId + ", a[name='" + id + "']").length) {
            sr.sink.emit("err", name, { message: "Link to missing anchor: '" + id + "'" });
            seenErrors = true;
        }
    });
    if (!seenErrors) sr.sink.emit("ok", name);
    cb();
};
