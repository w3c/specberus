const self = {
    name: 'headers.logo',
    section: 'front-matter',
    rule: 'logo',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const logo = sr.jsDocument.querySelector(
        "body div.head a[href] > img[src][height='48'][width='72'][alt='W3C']"
    );
    if (
        !logo ||
        !/^(https:)?\/\/www\.w3\.org\/StyleSheets\/TR\/2021\/logos\/W3C?$/.test(
            logo.getAttribute('src')
        ) ||
        !/^(https:)?\/\/www\.w3\.org\/?$/.test(
            logo.parentElement.getAttribute('href')
        )
    ) {
        sr.error(self, 'not-found');
    }
    done();
};
