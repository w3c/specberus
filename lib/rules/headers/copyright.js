/**
 * @file check if the document uses right copyright.
 * @description for this rule.
 * 1. Get type of license(s) the group is using from the API.
 * 2. There're 2 types of license(s): copyright-documents and copyright-software. A group would choose either one or both in the Charter. If they choose both, they can mention either one in the document.
 * 3. For joint-publications, the license should be adopted by both groups.
 * 4. For "copyright-software", the url is https://www.w3.org/Consortium/Legal/copyright-software, the dated url is https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document, they are both allowed. The name in the API is "W3C Software and Document License", but the document would use text "permissive document license".
 * 5. For "copyright-documents", the url is https://www.w3.org/Consortium/Legal/copyright-documents. The name in the API is "W3C Document License", but the document would use text "document use".
 */
import { AB, TAG } from '../../util.js';

const self = {
    name: 'headers.copyright',
    section: 'front-matter',
    rule: 'copyright',
};

// W3C Software and Document License
const LICENSE_CS_TEXT = 'permissive document license';
const LICENSE_CS_URL = 'https://www.w3.org/Consortium/Legal/copyright-software';
const LICENSE_CS_DATED_URL =
    'https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document';
// W3C Document License
const LICENSE_CD_TEXT = 'document use';
const LICENSE_CD_URL =
    'https://www.w3.org/Consortium/Legal/copyright-documents';

const LICENSE_URL_TEXT_MAP = {
    [LICENSE_CD_URL]: LICENSE_CD_TEXT,
    [LICENSE_CS_URL]: LICENSE_CS_TEXT,
};

const LICENSE_TEXT_LINKS_MAP = {
    [LICENSE_CD_TEXT]: [LICENSE_CD_URL],
    [LICENSE_CS_TEXT]: [LICENSE_CS_URL, LICENSE_CS_DATED_URL],
};

const latestBaseLinks = {
    Copyright: 'https://www.w3.org/Consortium/Legal/ipr-notice#Copyright',
    'World Wide Web Consortium': 'https://www.w3.org/',
    liability:
        'https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer',
    trademark: 'https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks',
};

export const { name } = self;

async function isOnlyPublishedByTagOrAb(sr) {
    const TagID = TAG.id;
    const AbID = AB.id;

    const delivererIDs = await sr.getDelivererIDs();
    return delivererIDs.every(id => [TagID, AbID].includes(id));
}

// Create an array of license URIs per group -> array of arrays
// Then find the intersection of all arrays, to extract union license(s)
function getCommonLicenseUri(data) {
    return data
        .map(charter => charter['doc-licenses'].map(license => license.uri))
        .reduce((first, cur) => first.filter(uri => cur.includes(uri)));
}
// The date can be 19xx-2023, or 2023.
function getLatestCopyrightMatchRegex(sr, licenseTexts) {
    const licenseRex = licenseTexts.join('|');
    const year = (sr.getDocumentDate() || new Date()).getFullYear();

    const startRex = `^Copyright [©|&copy;] (?:(?:199\\d|20\\d\\d)-)?${year} *World Wide Web Consortium`;
    const endRex = `\\. W3C[®|&reg;] liability, trademark,? and (${licenseRex}) rules apply\\.$`;
    return new RegExp(startRex + endRex);
}

function checkCopyright(sr, copyright, licenseTexts, baseLinks, matchRegex) {
    const regResult = sr.norm(copyright.textContent).match(matchRegex);
    if (!regResult) {
        sr.error(self, 'no-match', { rex: matchRegex });
        return;
    }

    const [, licenseInDoc] = regResult;
    const allowBothLicense = licenseTexts.length === 2;
    const textsToCheck = allowBothLicense ? [licenseInDoc] : licenseTexts; // When document can have 2 licenses, keep the one mentioned in document.
    const linksToCheck = textsToCheck.reduce(
        (acc, v) => ({ ...acc, [v]: LICENSE_TEXT_LINKS_MAP[v] }),
        baseLinks
    );

    // check the links
    const links = Array.from(copyright.querySelectorAll('a'));
    Object.keys(linksToCheck).forEach(linkText => {
        const link = links.find(link =>
            sr.norm(link.textContent).includes(linkText)
        );

        if (!link) {
            return sr.error(self, 'no-link', { text: linkText });
        }

        const expected = linksToCheck[linkText];
        const isExpectedArray = expected instanceof Array;
        const linkFound = isExpectedArray
            ? expected.some(v => v === link.href)
            : expected === link.href;

        if (!linkFound) {
            sr.error(self, 'href-not-match', {
                expected: isExpectedArray ? expected.join("' or '") : expected,
                hrefInDoc: link.href,
                text: linkText,
            });
        }
    });
}

function checkLatestCopyright(sr, copyright, licenseTexts) {
    const matchRegex = getLatestCopyrightMatchRegex(sr, licenseTexts);
    checkCopyright(sr, copyright, licenseTexts, latestBaseLinks, matchRegex);
}

/**
 * @param sr
 * @param done
 */
export async function check(sr, done) {
    const copyright = sr.jsDocument.querySelector('body div.head p.copyright');

    if (!copyright) {
        sr.error(self, 'not-found');
        return done();
    }

    if (await isOnlyPublishedByTagOrAb(sr)) {
        return done();
    }

    const chartersData = await sr.getChartersData();
    if (!chartersData || !chartersData.length) {
        sr.error(self, 'no-data-from-API');
        return done();
    }

    const allowedLicenses = getCommonLicenseUri(chartersData);
    if (!allowedLicenses.length && chartersData.length > 1) {
        sr.error(self, 'no-license-found-joint');
        return done();
    }
    if (!allowedLicenses.length) {
        sr.error(self, 'no-license-found');
        return done();
    }

    // licenseTexts: ['permissive document license'] or ['document use'] or ['document use', 'permissive document license']
    const licenseTexts = allowedLicenses
        .filter(v => [LICENSE_CD_URL, LICENSE_CS_URL].includes(v))
        .map(v => LICENSE_URL_TEXT_MAP[v]);

    checkLatestCopyright(sr, copyright, licenseTexts);

    return done();
}
