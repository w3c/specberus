
exports.name = "structure.h2";
exports.check = function (sr, done) {
    var h2s = [];
    sr.$("h2").each(function () {
        var $h2 = sr.$(this)
        ,   inHead = false
        ;
        // whacko doesn't really do .parents(selector)
        $h2.parents().each(function () {
            var $el = sr.$(this);
            if (($el[0].name || $el[0].tagName).toLowerCase() === "div" && $el.hasClass("head")) {
                inHead = true;
                return false;
            }
        });
        if (!inHead) h2s.push($h2.text());
    });
    // console.log(h2s);
    if (h2s[0] !== "Abstract")
        sr.sink.emit("err", this.name, "First h2 after div.head must be Abstract");
    if (h2s[1] !== "Status of This Document")
        sr.sink.emit("err", this.name, "Second h2 after div.head must be Status of This Document");
    if (h2s[2] !== "Table of Contents")
        sr.sink.emit("err", this.name, "Third h2 after div.head must be Table of Contents");
    done();
};
