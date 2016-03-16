/**
 * Miscellaneous utilities, mostly String-related routines.
 */

const REGEX_URI = /https?:\/\/(www\.)?((.+)[^\ \/])\/?$/i;

/**
 * Reduce a URI to its minimum expression, for easier comparison.
 *
 * This works heuristically; it strips a URI of the usual variants and converts it to lowercase
 * ("www." at the beginning, "/" at the end)
 *
 * @param {String} uri - Original URI.
 * @returns {String} The "normalised", (probably) equivalent URI.
 */

const normaliseURI = function(uri) {

    var result = uri.trim().toLowerCase();
    const matches = REGEX_URI.exec(result);

    if (matches && matches.length > 2) {
        result = matches[2];
    }

    return result;

};

exports.normaliseURI = normaliseURI;
