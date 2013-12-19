
exports.check = function (doc, $, sink, cb) {
    var name = "dummy.dahut";
    var $res = $("#bar > section.inner p[data-foo]", doc);
    if ($res.length && $res.text().indexOf("DAHUT") >= 0) sink.emit("ok", name);
    else sink.emit("error", name);
    cb();
};
