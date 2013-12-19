
exports.check = function (doc, $, sink, cb) {
    var name = "dummy.has-h1";
    var $res = $("h1", doc);
    if ($res.length) sink.emit("ok", name);
    else sink.emit("error", name);
    cb();
};
