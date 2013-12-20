
exports.check = function ($, sink, sr, cb) {
    var name = "dummy.dahut";
    var $res = $("#bar > section.inner p[data-foo]");
    if ($res.length && $res.text().indexOf("DAHUT") >= 0) sink.emit("ok", name);
    else sink.emit("err", name);
    cb(name);
};
