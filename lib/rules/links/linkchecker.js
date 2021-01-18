// Check every sources(img, stylesheets, scripts) are in same folder as spec document, and they are reachable. Other html files linked by the spec should also be accessable.
const puppeteer = require('puppeteer');

const self = {
    name: 'links.linkchecker'
,   section: 'document-body'
,   rule: 'brokenLink'
};

const compound = {
    name: 'links.linkchecker'
,   section: 'compound'
,   rule: 'compoundFilesLocation'
};

const allowList = [
    // use RegExp for all resources like:
    //     'https://www.w3.org/StyleSheets/TR/2016/base.css',
    //     'https://www.w3.org/StyleSheets/TR/2016/W3C-CR',(also W3C-CRD, W3C-WD),
    //     'https://www.w3.org/StyleSheets/TR/2016/logos/W3C',
    new RegExp('^https://www.w3.org/StyleSheets/TR/2016/'),
    'https://www.w3.org/scripts/TR/2016/fixup.js',
    'https://www.w3.org/TR/tr-outdated-spec',
    'https://www.w3.org/analytics/piwik/matomo.js',
    'https://www.w3.org/analytics/piwik/matomo.php'
];
const noRespondAllowList = [
    'https://www.w3.org/TR/tr-outdated-spec'
];

exports.name = self.name;

function simplifyURL(url) {
    var urlObj = new URL(url);
    return urlObj.origin + urlObj.pathname;
}

// Upgrade version of Array.include(). The array can be RegExp
function includedByReg(url, regArray = allowList) {
    return regArray.some(item => {
        if (typeof item === 'object') {
            // item is RegExp
            return item.test(url);
        } else {
            // item is simple string
            return item === url;
        }
    });
}

exports.check = async function (sr, done) {
    // send out warning for /nu W3C link checker.
    sr.warning(self, "display", { link: sr.url });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const dts = sr.extractHeaders(sr.jsDocument.querySelector("body div.head dl"));
    // thisLink is used as base url. Every other resources should use in same folder as base. e.g.
    // url: https://www.w3.org/TR/css3-conditional/
    // image: https://www.w3.org/TR/2020/css3-conditional/image/img.jpg
    const thisLink = dts && dts.This && dts.This.dd.querySelector("a").href;
    if (!thisLink) {
        return done();
    }

    page.on('response', response => {
        var url = simplifyURL(response.url());
        var referer = response.request()._headers.referer;

        // check if resource is in same folder as base document
        if (!url.startsWith(thisLink) && !(includedByReg(url) || includedByReg(referer))) {
            sr.error(compound, 'not-same-folder', { base: thisLink, url });
        }

        // check if every resource's status code is ok
        if (!response.ok() && !noRespondAllowList.includes(url)) {
            sr.error(compound, 'response-error', {
                url,
                status: response.status(),
                text: response.statusText(),
                referer
            });
        }
    });

    await page.goto(sr.url);
    done();
};
