
exports.name = "structure.h2";
exports.check = function (sr, done) {
    var h2s = [];
    sr.$("h2").each(function () {
        var $h2 = sr.$(this);
        if ($h2.parents("div.head").length === 0) h2s.push(sr.norm($h2.text()));
    });
    if (h2s[0] !== "Abstract") sr.error(this.name, "abstract", { was: h2s[0] });
    if (!/^Status [Oo]f [Tt]his [Dd]ocument$/.test(h2s[1])) sr.error(this.name, "sotd", { was: h2s[1] });
    if (!/^Table [Oo]f [Cc]ontents$/.test(h2s[2])) sr.error(this.name, "toc", { was: h2s[2] });
    done();
};
