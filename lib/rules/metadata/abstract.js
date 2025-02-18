/**
 * Pseudo-rule for metadata extraction: abstract.
 */

export const name = 'metadata.abstract';

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    let abstractTitle;
    Array.prototype.some.call(sr.jsDocument.querySelectorAll('h2'), h2 => {
        if (sr.norm(h2.textContent).toLowerCase() === 'abstract') {
            abstractTitle = h2;
            return true;
        }
    });

    if (abstractTitle) {
        const div = sr.jsDocument.createElement('div');
        [...abstractTitle.parentElement.children].forEach(child => {
            {
                if (child !== abstractTitle) {
                    div.appendChild(child.cloneNode(true));
                }
            }
        });
        return done({ abstract: sr.norm(div.innerHTML) });
    } else {
        return done({ abstract: 'Not found' });
    }
}
