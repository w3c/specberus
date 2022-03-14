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
    if (!processDocument || !processDocument.getAttribute('href')) {
        return done();
    }
    return done({ process: processDocument.getAttribute('href') });
}
