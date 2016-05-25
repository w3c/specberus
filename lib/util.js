/**
 * Miscellaneous utilities.
 */

const profiles = {};

// @TODO: retrieve this list of filenames from the filesystem, instead of hard-coding them here.
("FPWD FPCR WD CR PR PER REC RSCND " +
"CG-NOTE FPIG-NOTE IG-NOTE FPWG-NOTE WG-NOTE " +
"WD-Echidna WG-NOTE-Echidna " +
"MEM-SUBM TEAM-SUBM").split(" ")
    .forEach(function (p) {
        profiles[p] = require('./profiles/' + p);
    })
;

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

const processParams = function(params, base, constraints) {
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
            if (result.hasOwnProperty(p))
                throw new Error('Parameter “' + p + '” is used more than once');
            else if ('string' === typeof params[p]) {
                if (profiles.hasOwnProperty(params[p]))
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
            'informativeOnly' === p || 'echidnaReady' === p || 'events' === p) {
            // Other params:
            if (result.hasOwnProperty(p))
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
        if(constraints && constraints.required) {
            // Extra required params:
            for (var c in constraints.required)
                if (!result.hasOwnProperty(constraints.required[c]))
                    throw new Error('Parameter “' + constraints.required[c] + '” is required in this context');
        }
        if(constraints && constraints.forbidden) {
            // Forbidden params:
            for (var c in constraints.forbidden)
                if (result.hasOwnProperty(constraints.forbidden[c]))
                    throw new Error('Parameter “' + constraints.forbidden[c] + '” is not allowed in this context');
        }
    }
    return result;
};

exports.profiles = profiles;
exports.buildJSONresult = buildJSONresult;
exports.processParams = processParams;
