
exports.check = function ($, sink, cb) {
    var name = "dummy.has-h2-foo";
    var $res = $("h2.foo");
    if ($res.length) sink.emit("ok", name);
    else sink.emit("error", name);
    cb(name);
};
