/**
 * Pseudo-rule for metadata extraction: process.
 */

// const self = {
//     name: 'metadata.process'
// ,   section: 'document-status'
// ,   rule: 'whichProcess'
// };

export const name = 'metadata.process';

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const processDocument = sr.jsDocument.querySelector(
        'a#w3c_process_revision'
    );
    const processDocumentHref =
        processDocument && processDocument.getAttribute('href');
    if (!processDocumentHref) {
        return done();
    }
    const process =
        processDocumentHref === 'https://www.w3.org/2023/Process-20231103/'
            ? 'https://www.w3.org/policies/process/20231103/'
            : processDocumentHref;
    return done({ process });
}
