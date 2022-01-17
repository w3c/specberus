const rule = 'structure.h2';
const abstract = {
    name: rule,
    section: 'front-matter',
    // @TODO: is there a better rule for this one?
    rule: 'divClassHead',
};
const sotd = {
    name: rule,
    section: 'document-status',
    rule: 'sotd',
};
const toc = {
    name: rule,
    section: 'navigation',
    rule: 'toc',
};
exports.name = rule;

exports.check = function (sr, done) {
    const h2s = [];
    const excludeH2 = sr.jsDocument.querySelectorAll('.head h2');
    sr.jsDocument.querySelectorAll('h2').forEach(h2 => {
        if (Array.prototype.indexOf.call(excludeH2, h2) < 0)
            h2s.push(sr.norm(h2.textContent));
    });
    if (h2s[0] !== 'Abstract') sr.error(abstract, 'abstract', { was: h2s[0] });
    // cspell:disable-next-line
    if (!/^Status [Oo]f [Tt]his [Dd]ocument$/.test(h2s[1]))
        sr.error(sotd, 'sotd', { was: h2s[1] });
    // cspell:disable-next-line
    if (!/^Table [Oo]f [Cc]ontents$/.test(h2s[2]))
        sr.error(toc, 'toc', { was: h2s[2] });
    done();
};
