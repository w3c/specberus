/**
 * Miscellaneous utilities.
 */

const fs = require('fs');

const files1 = fs.readdirSync(`${__dirname}/profiles/TR/`),
    files2 = fs.readdirSync(`${__dirname}/profiles/SUBM/`),
    profiles = {};

/**
 * Build a JSON result (of validation, metadata extraction, etc).
 *
 * @param {Array} err - errors.
 * @param {Array} warn - warnings.
 * @param {Array} inf - informative messages.
 * @param {Object} metadata - dictionary with some found metadata.
 */

const buildJSONresult = function(err, warn, inf, metadata) {

    return {
        success: 0 === err.length
    ,   errors: err
    ,   warnings: warn
    ,   info: inf
    ,   metadata: metadata
    };

};

/**
 * Build a function that builds an “options” object based on certain parameters.
 *
 * @param {Object} profiles - valid profiles.
 *
 * @returns {Function} a function that builds an “options” object based on an HTTP query string or a similar object containing options.
 */

const buildProcessParamsFunction = function(profiles) {

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
     * @param {Object} params - an HTTP request query, or a similar object.
     * @param {Object} base - (<strong>optional</strong>) a template or “base” object to build from.
     * @param {Object} constraints - (<strong>optional</strong>) an object listing “required” and/or “forbidden” parameters.
     *
     * @returns {Object} an “options” object that can be used by Specberus.
     *
     * @throws {Error} if there is an error in the parameters.
     */

    return function(params, base, constraints) {
        const result = base ? JSON.parse(JSON.stringify(base)): {};
        var originFound = false;
        for (var p in params) {
            if ('url' === p || 'source' === p || 'file' === p || 'document' === p) {
                // Origins: only one allowed.
                if (originFound)
                    throw new Error('Only one of parameters {“url”, “source”, “file”, “document”} is allowed');
                originFound = true;
                result[p] = params[p];
            }
            else if ('profile' === p) {
                // Profile: if it's a string, load the corresponding object.
                if (Object.prototype.hasOwnProperty.call(result, p))
                    throw new Error('Parameter “' + p + '” is used more than once');
                else if ('string' === typeof params[p]) {
                    if (Object.prototype.hasOwnProperty.call(profiles, params[p]))
                        result[p] = profiles[params[p]];
                    else if ('auto' === params[p])
                        result[p] = 'auto';
                    else
                        throw new Error('Unknown profile “' + params[p] + '”');
                }
                else
                    result[p] = params[p];
            }
            else if ('validation' === p || 'htmlValidator' === p || 'cssValidator' === p ||
                'patentPolicy' === p || 'processDocument' === p || 'noRecTrack' === p ||
                'informativeOnly' === p || 'echidnaReady' === p || 'events' === p ||
                'editorial' === p) {
                // Other params:
                if (Object.prototype.hasOwnProperty.call(result, p))
                    throw new Error('Parameter “' + p + '” is used more than once');
                result[p] = params[p];
            }
            else if (!constraints || !constraints.allowUnknownParams)
                // Illegal params:
                throw new Error('Illegal parameter “' + p + '”');
        }
        if (!originFound)
            // Origin: one required.
            throw new Error('One parameter of {“url”, “source”, “file”, “document”} is required');
        else {
            var c;
            if(constraints && constraints.required) {
                // Extra required params:
                for (c in constraints.required)
                    if (!Object.prototype.hasOwnProperty.call(result, constraints.required[c]))
                        throw new Error('Parameter “' + constraints.required[c] + '” is required in this context');
            }
            if(constraints && constraints.forbidden) {
                // Forbidden params:
                for (c in constraints.forbidden)
                    if (Object.prototype.hasOwnProperty.call(result, constraints.forbidden[c]))
                        throw new Error('Parameter “' + constraints.forbidden[c] + '” is not allowed in this context');
            }
        }
        return result;
    };
};

[...files1.map((x) => `TR/${x}`), ...files2.map((x) => `SUBM/${x}`)].forEach((i) => {
    var valid = /((TR|SUBM)\/([A-Z][A-Z-]*[A-Z](-Echidna)?))\.js$/.exec(i);
    if (valid && valid.length > 3)
        profiles[valid[3]] = require(`./profiles/${valid[1]}`);
});

const nextUntil = function (elem, selector, filter) {
    var siblings = [];
    elem = elem.nextElementSibling;
    while (elem) {
        if (elem.matches(selector)) break;
        if (filter && !elem.matches(filter)) {
            elem = elem.nextElementSibling;
            continue;
        }
        siblings.push(elem);
        elem = elem.nextElementSibling;
    }
    return siblings;
};

const nextAll = function (elem, selector, filter) {
    var siblings = [];
    elem = elem.nextElementSibling;
    while (elem) {
        if (filter && !elem.matches(filter)) {
            elem = elem.nextElementSibling;
            continue;
        }
        if (elem.matches(selector)) {
            siblings.push(elem);
        }
        elem = elem.nextElementSibling;
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
    if (!elements || !elements.length) return null;
    return Array.prototype.filter.call(elements, element =>
        element.tagName == tagName.toUpperCase()
    );
};

exports.profiles = profiles;
exports.buildJSONresult = buildJSONresult;
exports.processParams = buildProcessParamsFunction(profiles);
exports.nextUntil = nextUntil;
exports.filter = filter;
exports.next = next;
exports.nextAll = nextAll;
