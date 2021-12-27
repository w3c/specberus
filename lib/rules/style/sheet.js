const util = require('../../util');

const rule = 'style.sheet';
const section = 'metadata';
const missing = {
    name: rule,
    section,
    rule: 'goodStylesheet',
};
const notLast = {
    name: rule,
    section,
    rule: 'lastStylesheet',
};
exports.name = rule;

exports.check = function (sr, done) {
    if (!sr.config.styleSheet) return done();
    const url = `https://www.w3.org/StyleSheets/TR/2021/${sr.config.styleSheet}`;
    const dark = 'https://www.w3.org/StyleSheets/TR/2021/dark';
    const stylesheetLinks = [
        `head > link[rel=stylesheet][href='${url}']`,
        `head > link[rel=stylesheet][href='${url}.css']`,
    ];
    const lnk = sr.jsDocument.querySelectorAll(stylesheetLinks.join(', '));
    if (!lnk.length) sr.error(missing, 'not-found', { url });
    else {
        const siblings = util.nextAll(lnk, 'link[rel=stylesheet], style');
        if (
            siblings.length ||
            (siblings.length === 1 &&
                (siblings[0].href !== dark ||
                    siblings[0].href !== `${dark}.css`))
        ) {
            sr.error(notLast, 'last');
        }
    }
    done();
};
