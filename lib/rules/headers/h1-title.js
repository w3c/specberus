
// must have h1, with same content as title

exports.check = function (sr, cb) {
    var name = "headers.h1-title"
    ,   $title = sr.$("head > title").first()
    ,   $h1 = sr.$("body > div.head:first-child h1").first()
    ;
    if ($title.length && $h1.length && $title.text() === $h1.text()) sr.sink.emit("ok", name);
    else sr.sink.emit("err", name, { message: "Content of title and h1 do not match. "});
    cb();
};
