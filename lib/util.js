/**
 * Miscellaneous utilities.
 */

const fs = require('fs');

const filesTR = fs.readdirSync(`${__dirname}/profiles/TR/`);
const filesSUBM = fs.readdirSync(`${__dirname}/profiles/SUBM/`);
const profiles = {};

/**
 * Build a JSON result (of validation, metadata extraction, etc).
 *
 * @param {Array} err - errors.
 * @param {Array} warn - warnings.
 * @param {Array} inf - informative messages.
 * @param {object} metadata - dictionary with some found metadata.
 */

const buildJSONresult = function (err, warn, inf, metadata) {
    return {
        success: err.length === 0,
        errors: err,
        warnings: warn,
        info: inf,
        metadata,
    };
};

/**
 * Build a function that builds an “options” object based on certain parameters.
 *
 * @param {object} profiles - valid profiles.
 * @returns {Function} a function that builds an “options” object based on an HTTP query string or a similar object containing options.
 */

const buildProcessParamsFunction = function (profiles) {
    /**
     * Build an “options” object based on an HTTP query string or a similar object containing options.
     *
     * An example of <code>constraints</code>:
     * <blockquote><pre>{
     *     "required": ["processDocument"],
     *     "forbidden": ["echidnaReady", "bogusParam"],
     *     "allowUnknownParams": true
     * }</pre>/blockquote>
     *
     * @param {object} params - an HTTP request query, or a similar object.
     * @param {object} base - (<strong>optional</strong>) a template or “base” object to build from.
     * @param {object} constraints - (<strong>optional</strong>) an object listing “required” and/or “forbidden” parameters.
     * @returns {object} an “options” object that can be used by Specberus.
     * @throws {Error} if there is an error in the parameters.
     */

    return function (params, base, constraints) {
        const result = base ? JSON.parse(JSON.stringify(base)) : {};
        let originFound = false;
        for (const p in params) {
            if (
                p === 'url' ||
                p === 'source' ||
                p === 'file' ||
                p === 'document'
            ) {
                // Origins: only one allowed.
                if (originFound)
                    throw new Error(
                        'Only one of parameters {“url”, “source”, “file”, “document”} is allowed'
                    );
                originFound = true;
                result[p] = params[p];
            } else if (p === 'profile') {
                // Profile: if it's a string, load the corresponding object.
                if (Object.prototype.hasOwnProperty.call(result, p))
                    throw new Error(`Parameter “${p}” is used more than once`);
                else if (typeof params[p] === 'string') {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            profiles,
                            params[p]
                        )
                    )
                        result[p] = profiles[params[p]];
                    else if (params[p] === 'auto') result[p] = 'auto';
                    else throw new Error(`Unknown profile “${params[p]}”`);
                } else result[p] = params[p];
            } else if (
                p === 'validation' ||
                p === 'htmlValidator' ||
                p === 'cssValidator' ||
                p === 'patentPolicy' ||
                p === 'processDocument' ||
                p === 'informativeOnly' ||
                p === 'echidnaReady' ||
                p === 'events' ||
                p === 'editorial'
            ) {
                // Other params:
                if (Object.prototype.hasOwnProperty.call(result, p))
                    throw new Error(`Parameter “${p}” is used more than once`);
                result[p] = params[p];
            } else if (!constraints || !constraints.allowUnknownParams)
                // Illegal params:
                throw new Error(`Illegal parameter “${p}”`);
        }
        if (!originFound)
            // Origin: one required.
            throw new Error(
                'One parameter of {“url”, “source”, “file”, “document”} is required'
            );
        else {
            let c;
            if (constraints && constraints.required) {
                // Extra required params:
                for (c in constraints.required)
                    if (
                        !Object.prototype.hasOwnProperty.call(
                            result,
                            constraints.required[c]
                        )
                    )
                        throw new Error(
                            `Parameter “${constraints.required[c]}” is required in this context`
                        );
            }
            if (constraints && constraints.forbidden) {
                // Forbidden params:
                for (c in constraints.forbidden)
                    if (
                        Object.prototype.hasOwnProperty.call(
                            result,
                            constraints.forbidden[c]
                        )
                    )
                        throw new Error(
                            `Parameter “${constraints.forbidden[c]}” is not allowed in this context`
                        );
            }
        }
        return result;
    };
};

// Get rules of each profile
let TRProfiles = [];
filesTR.forEach(track => {
    if (!track.startsWith('.')) {
        const profileNames = fs
            .readdirSync(`${__dirname}/profiles/TR/${track}/`)
            .map(profileName => `${track}/${profileName}`);
        TRProfiles = [...TRProfiles, ...profileNames];
    }
});

const allProfiles = [
    ...TRProfiles.map(x => `TR/${x}`),
    ...filesSUBM.map(x => `SUBM/${x}`),
];
allProfiles.forEach(i => {
    const valid =
        /((TR|SUBM)\/([A-Za-z]+\/)?([A-Z][A-Z-]*[A-Z](-Echidna)?))\.js$/.exec(
            i
        );
    if (valid && valid.length > 3)
        // eslint-disable-next-line import/no-dynamic-require
        profiles[valid[4]] = require(`./profiles/${valid[1]}`);
});
exports.allProfiles = allProfiles;

const nextUntil = function (elem, selector, filter) {
    const siblings = [];
    elem = elem.nextElementSibling;
    while (elem) {
        if (elem.matches(selector)) break;
        if (filter && !elem.matches(filter)) {
            elem = elem.nextElementSibling;
        } else {
            siblings.push(elem);
            elem = elem.nextElementSibling;
        }
    }
    return siblings;
};

const nextAll = function (elem, selector, filter) {
    const siblings = [];
    elem = elem.nextElementSibling;
    while (elem) {
        if (filter && !elem.matches(filter)) {
            elem = elem.nextElementSibling;
        } else {
            if (elem.matches(selector)) {
                siblings.push(elem);
            }
            elem = elem.nextElementSibling;
        }
    }
    return siblings;
};

const next = function (elem, selector) {
    elem = elem.nextElementSibling;
    while (elem) {
        if (elem.matches(selector)) {
            return elem;
        }
        elem = elem.nextElementSibling;
    }
};

const filter = function (elements, tagName) {
    if (!elements || !elements.length) return [];
    return Array.prototype.filter.call(
        elements,
        element => element.tagName === tagName.toUpperCase()
    );
};

exports.profiles = profiles;
exports.buildJSONresult = buildJSONresult;
exports.processParams = buildProcessParamsFunction(profiles);
exports.nextUntil = nextUntil;
exports.filter = filter;
exports.next = next;
exports.nextAll = nextAll;
exports.TAG = { id: 34270, type: 'other' };
exports.AB = { id: 7756, type: 'other' };
exports.REC_TEXT = {
    SOTD_P_COR: 'It includes proposed correction(s)?.',
    SOTD_P_ADD:
        'It includes proposed addition(s)?, introducing new feature(s)? since the previous Recommendation.',
    SOTD_P_COR_ADD:
        'It includes proposed amendment(s)?, introducing substantive change(s)? and new feature(s)? since the previous Recommendation.',
    SOTD_C_COR: 'It includes candidate correction(s)?.',
    SOTD_C_ADD:
        'It includes candidate addition(s)?, introducing new feature(s)? since the previous Recommendation.',
    SOTD_C_COR_ADD:
        'It includes candidate amendment(s)?, introducing substantive change(s)? and new feature(s)? since the previous Recommendation.',
};
