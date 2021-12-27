/**
 * Check the presence of a valid ToC.
 */

const self = {
    name: 'headers.h2-toc',
    // @TODO: fix the section... when it is fixed in the JSON.
    section: 'navigation',
    // @TODO: update this selector... when the rule is added to the JSON.
    rule: 'toc',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const EXPECTED_HEADING = /^table\s+of\s+contents$/i;
    const tocNav = sr.jsDocument.querySelectorAll('nav#toc > h2');
    const tocDiv = sr.jsDocument.querySelectorAll('div#toc > h2');
    let toc;

    if (tocDiv.length > 0) {
        if (tocNav.length > 0) sr.error(self, 'mixed');
        else {
            sr.warning(self, 'not-html5');
            toc = tocDiv;
        }
    } else if (tocNav.length > 0) toc = tocNav;
    else sr.error(self, 'not-found');
    if (toc && toc.length > 0) {
        let matches = 0;
        for (let i = 0; i < toc.length; i += 1)
            if (EXPECTED_HEADING.test(sr.norm(toc[i].textContent)))
                matches += 1;
        if (matches > 1) sr.error(self, 'too-many');
        else if (matches === 0) sr.error(self, 'not-found');
    }

    done();
};
