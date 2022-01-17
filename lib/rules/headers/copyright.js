/**
 * @file check if the document uses right copyright.
 * @description for this rule.
 * 1. Get type of license(s) the group is using from the API.
 * 2. There're 2 types of license(s): copyright-documents and copyright-software. A group would choose either one or both in the Charter. If they choose both, they can mention either one in the document.
 * 3. For joint-publications, the license should be adopted by both groups.
 * 4. For "copyright-software", the url is https://www.w3.org/Consortium/Legal/copyright-software, the dated url is https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document, they are both allowed. The name in the API is "W3C Software and Document License", but the document would use text "permissive document license".
 * 5. For "copyright-documents", the url is https://www.w3.org/Consortium/Legal/copyright-documents. The name in the API is "W3C Document License", but the document would use text "document use".
 */

const self = {
    name: 'headers.copyright',
    section: 'front-matter',
    rule: 'copyright',
};

const util = require('../../util');

// W3C Software and Document License
const LICENSE_CS_TEXT = 'permissive document license';
const LICENSE_CS_URL = 'https://www.w3.org/Consortium/Legal/copyright-software';
const LICENSE_CS_DATED_URL =
    'https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document';
// W3C Document License
const LICENSE_CD_TEXT = 'document use';
const LICENSE_CD_URL =
    'https://www.w3.org/Consortium/Legal/copyright-documents';

const linksToCheckBase = {
    Copyright: 'https://www.w3.org/Consortium/Legal/ipr-notice#Copyright',
    W3C: 'https://www.w3.org/',
    MIT: 'https://www.csail.mit.edu/',
    ERCIM: 'https://www.ercim.eu/',
    Keio: 'https://www.keio.ac.jp/',
    Beihang: 'https://ev.buaa.edu.cn/',
    liability:
        'https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer',
    trademark: 'https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks',
};

exports.name = self.name;

exports.check = async function (sr, done) {
    const copyright = sr.jsDocument.querySelector('body div.head p.copyright');
    if (copyright) {
        // Skip check if the document is only published by TAG and/or AB
        const TagID = util.TAG.id;
        const AbID = util.AB.id;
        const deliverers = await sr.getDelivererIDs();
        // groupIds: a list of ids without TAG or AB
        const groupIds = deliverers.filter(
            deliverer => ![TagID, AbID].includes(deliverer)
        );
        if (!groupIds.length) return done();

        let allowBothLicense = false;
        const chartersData = await sr.getChartersData();
        if (!chartersData || !chartersData.length) {
            sr.error(self, 'no-data-from-API');
            return done();
        }
        const isJointPublication = chartersData.length > 1;

        const licenses = [
            ...chartersData.map(c => c['doc-licenses'].map(l => l.uri)),
        ]; // creates an array of license URIs per group -> array of arrays
        const allowedLicenses = licenses.reduce((a, b) =>
            a.filter(c => b.includes(c))
        ); // find the intersection of all arrays

        if (!allowedLicenses.length) {
            if (isJointPublication) {
                sr.error(self, 'no-license-found-joint');
                return done();
            }
            sr.error(self, 'no-license-found');
            return done();
        }

        // linksToCheck: links and urls that should appear in doc.
        const linksToCheck = { ...linksToCheckBase };
        // licenseTexts: ['permissive document license'] or ['document use'] or ['document use', 'permissive document license']
        const licenseTexts = [];
        allowedLicenses.forEach(license => {
            if (license === LICENSE_CD_URL) {
                licenseTexts.push(LICENSE_CD_TEXT);
                linksToCheck[LICENSE_CD_TEXT] = [LICENSE_CD_URL];
            } else if (license === LICENSE_CS_URL) {
                licenseTexts.push(LICENSE_CS_TEXT);
                linksToCheck[LICENSE_CS_TEXT] = [
                    LICENSE_CS_URL,
                    LICENSE_CS_DATED_URL,
                ];
            }
        });

        // allowBothLicense: copyright can claim either license.
        if (licenseTexts.length === 2) allowBothLicense = true;
        const licenseRex = licenseTexts.join('|');

        const year = (sr.getDocumentDate() || new Date()).getFullYear();
        const startRex = `^Copyright [©|&copy;] (?:(?:199\\d|20\\d\\d)-)?${year} *W3C[®|&reg;] \\(MIT, ERCIM, Keio, Beihang\\)`;
        const endRex = `\\. W3C liability, trademark,? and (${licenseRex}) rules apply\\.$`;

        // check text of copyright
        const rex = new RegExp(startRex + endRex);
        const text = sr.norm(copyright.textContent);
        const regResult = text.match(rex);
        if (!regResult) {
            sr.error(self, 'no-match', { rex });
            return done();
        }

        const [, licenseInDoc] = regResult;

        // When document can have 2 licenses, remove one of the link which is not mentioned in document.
        if (allowBothLicense) {
            if (licenseInDoc === LICENSE_CS_TEXT) {
                delete linksToCheck[LICENSE_CD_TEXT];
            } else if (licenseInDoc === LICENSE_CD_TEXT) {
                delete linksToCheck[LICENSE_CS_TEXT];
            }
        }

        // check the links
        const copyrightLinks = [...copyright.querySelectorAll('a')];
        Object.keys(linksToCheck).forEach(linkText => {
            const link = copyrightLinks.filter(a =>
                sr.norm(a.textContent).includes(linkText)
            )[0];

            if (!link) return sr.error(self, 'no-link', { text: linkText });

            let expectedHref = linksToCheck[linkText];
            let linkFound = false;
            // "permissive document license" can have 2 valid urls.
            if (expectedHref instanceof Array) {
                linkFound = expectedHref.indexOf(link.href) > -1;
                expectedHref = expectedHref.join("' or '");
            } else {
                linkFound = link.href === expectedHref;
            }
            if (!linkFound) {
                sr.error(self, 'href-not-match', {
                    expected: expectedHref,
                    hrefInDoc: link.href,
                    text: linkText,
                });
            }
        });
    } else sr.error(self, 'not-found');
    return done();
};
