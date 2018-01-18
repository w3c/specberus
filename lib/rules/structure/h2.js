const name = 'structure.h2'
,   abstract = {
        name: name
    ,   section: 'front-matter'
        // @TODO: is there a better rule for this one?
    ,   rule: 'divClassHead'
    }
,   sotd = {
        name: name
    ,   section: 'document-status'
    ,   rule: 'sotd'
    }
,   toc = {
        name: name
    ,   section: 'navigation'
    ,   rule: 'toc'
    }
;

exports.name = name;

exports.check = function (sr, done) {
    var h2s = [];
    sr.$("h2").each(function () {
        var $h2 = sr.$(this);
        if ($h2.parents("div.head").length === 0) h2s.push(sr.norm($h2.text()));
    });
    if (h2s[0] !== "Abstract") sr.error(abstract, "abstract", { was: h2s[0] });
    if (!/^Status [Oo]f [Tt]his [Dd]ocument$/.test(h2s[1])) sr.error(sotd, "sotd", { was: h2s[1] });
    if (!/^Table [Oo]f [Cc]ontents$/.test(h2s[2])) sr.error(toc, "toc", { was: h2s[2] });
    done();
};
