
exports.check = function (sr, cb) {
    var name = "headers.logo"
    ,   $logo = sr.$("body > div.head:first-child a[href] > img[src][height=48][width=72][alt=W3C]")
                  .first()
    ;
    if ($logo &&
        /^(https?:)?\/\/www\.w3\.org\/Icons\/w3c_home(\.png|\.gif)?$/.test($logo.attr("src")) &&
        /^(https?:)?\/\/www\.w3\.org\/?$/.test($logo.parent().attr("href"))) {
        sr.sink.emit("ok", name);
    }
    else sr.sink.emit("err", name, { message: "Failed to include logo in link with absolute URLs. "});
    cb();
};
