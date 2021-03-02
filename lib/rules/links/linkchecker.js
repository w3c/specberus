// Check every sources(img, stylesheets, scripts) are in same folder as spec document, and they are reachable.
const puppeteer = require('puppeteer');

const self = {
    name: 'links.linkchecker',
    section: 'document-body',
    rule: 'brokenLink',
};

const compound = {
    name: 'links.linkchecker',
    section: 'compound',
    rule: 'compoundFilesLocation',
};

const allowList = [
    new RegExp('^https://www.w3.org/StyleSheets/TR/2016/'),
    new RegExp('^https://www.w3.org/scripts/'),
    'https://www.w3.org/TR/tr-outdated-spec',
    new RegExp('^https://www.w3.org/analytics/piwik/'),
];
const noRespondAllowList = ['https://www.w3.org/TR/tr-outdated-spec'];

exports.name = self.name;

function simplifyURL(url) {
    var urlObj = new URL(url);
    return urlObj.origin + urlObj.pathname;
}

// Upgrade version of Array.include(). The array can be RegExp
function includedByReg(url, regArray = allowList) {
    return regArray.some((item) => {
        if (typeof item === 'object') {
            // item is RegExp
            return item.test(url);
        }
        // item is simple string
        return item === url;
    });
}

exports.check = async function (sr, done) {
    // send out warning for /nu W3C link checker.
    sr.warning(self, 'display', { link: sr.url });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const dts = sr.extractHeaders(
        sr.jsDocument.querySelector('body div.head dl')
    );
    // thisLink is used as base url. Every other resources should use in same folder as base. e.g.
    // url: https://www.w3.org/TR/css3-conditional/
    // image: https://www.w3.org/TR/2020/css3-conditional/image/img.jpg
    const thisLink = dts && dts.This && dts.This.dd.querySelector('a').href;
    if (!thisLink) {
        return done();
    }

    page.on('response', (response) => {
        var url = simplifyURL(response.url());
        var referer = response.request()._headers.referer;

        // check if resource is in same folder as base document
        if (
            !url.startsWith(thisLink) &&
            !(includedByReg(url) || includedByReg(referer)) &&
            url !== sr.url
        ) {
            sr.error(compound, 'not-same-folder', { base: thisLink, url });
        }

        // check if every resource's status code is ok, ignore 3xx
        if (response.status() >= 400 && !noRespondAllowList.includes(url)) {
            const chain = response.request().redirectChain();
            // If an url is redirected from another, chain shall exist
            if (chain.length) {
                sr.error(compound, 'response-error-with-redirect', {
                    url,
                    originUrl: chain[0].url(),
                    status: response.status(),
                    text: response.statusText(),
                    referer,
                });
            } else {
                sr.error(compound, 'response-error', {
                    url,
                    status: response.status(),
                    text: response.statusText(),
                    referer,
                });
            }
        }
    });

    if (sr.url) {
        await page.goto(sr.url);
    } else {
        await page.setContent(sr.jsDocument.documentElement.innerHTML);
    }

    await browser.close();
    done();
};
