const util = require('../../util');
const rule = 'style.sheet',
    section = 'metadata',
    missing = {
        name: rule,
        section: section,
        rule: 'goodStylesheet',
    },
    notLast = {
        name: rule,
        section: section,
        rule: 'lastStylesheet',
    };
exports.name = rule;

exports.check = function (sr, done) {
    if (!sr.config.styleSheet) return done();
    var url = '//www.w3.org/StyleSheets/TR/2016/' + sr.config.styleSheet,
        sels = [
            "head > link[rel=stylesheet][href='" + url + "']",
            "head > link[rel=stylesheet][href='https:" + url + "']",
            "head > link[rel=stylesheet][href='" + url + ".css']",
            "head > link[rel=stylesheet][href='https:" + url + ".css']",
        ],
        lnk = sr.jsDocument.querySelectorAll(sels.join(', '));
    if (!lnk.length) sr.error(missing, 'not-found');
    else if (util.nextAll(lnk, 'link[rel=stylesheet], style').length) {
        sr.error(notLast, 'last');
    }
    done();
};
