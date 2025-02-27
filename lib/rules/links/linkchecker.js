// Check every sources(img, stylesheets, scripts) are in same folder as spec document, and they are reachable.
import puppeteer from 'puppeteer';

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
    /^https:\/\/www.w3.org\/StyleSheets\//,
    /^https:\/\/www.w3.org\/scripts\//,
    'https://www.w3.org/TR/tr-outdated-spec',
    /^https:\/\/www.w3.org\/analytics\/piwik\//,
    /^https:\/\/test.csswg.org\/harness\//,
    /^https:\/\/www.w3.org\/assets\//,
    /^https:\/\/static.cloudflareinsights.com\/beacon\.min\.js/,
    /^https:\/\/www.w3.org\/Icons\/member_subm\.png/,
    /^https:\/\/www.w3.org\/favicon\.ico/,
    /^data:/,
];
const noRespondAllowList = [
    'https://www.w3.org/TR/tr-outdated-spec',
    'https://www.w3.org/analytics/piwik/matomo.js',
];

export const { name } = self;

/**
 * @param url
 */
function simplifyURL(url) {
    const urlObj = new URL(url);
    return (
        (urlObj.origin !== 'null' ? urlObj.origin : urlObj.protocol) +
        urlObj.pathname
    );
}

/**
 * Upgrade version of Array.include(). The array can be RegExp
 *
 * @param url
 * @param regArray
 * @returns {boolean}
 */
function includedByReg(url, regArray = allowList) {
    return regArray.some(item => {
        if (typeof item === 'object') {
            // item is RegExp
            return item.test(url);
        }
        // item is simple string
        return item === url;
    });
}

/**
 * @param sr
 * @param done
 */
export async function check(sr, done) {
    // send out warning for /nu W3C link checker.
    sr.warning(self, 'display', { link: sr.url });

    if (!sr.url) {
        return done();
    }

    // sr.url is used as base url. Every other resources should use in same folder as base. e.g.
    // - spec doc: https://www.w3.org/TR/2021/WD-pubrules-20210401/
    // - image (pass): https://www.w3.org/TR/2021/WD-pubrules-20210401/images/sample.png
    // - image (pass): https://www.w3.org/TR/2021/WD-pubrules-20210401/sample.png
    // - image (error): https://w3c.github.io/pubrules/sample.png
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-gpu'],
    });
    const page = await browser.newPage();
    const docPath = sr.url.replace(/\/[^/]+$/, '/').replace(/^https?:/, '');
    const origin = new URL(sr.url).origin;

    page.on('response', response => {
        const url = simplifyURL(response.url());
        const { referer } = response.request().headers();

        if (url !== `${origin}/favicon.ico`) {
            // check if resource is in same folder as base document
            if (
                !url.replace(/^https?:/, '').startsWith(docPath) &&
                !(includedByReg(url) || includedByReg(referer)) &&
                url !== sr.url
            ) {
                sr.error(compound, 'not-same-folder', { base: docPath, url });
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
        }
    });

    await page.goto(sr.url, { waitUntil: 'load', timeout: 60000 });

    await browser.close();
    done();
}
