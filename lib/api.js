/**
 * Specberus REST API.
 */

// Internal packages:
const package = require('../package.json')
,   sink = require('./sink')
,   util = require('./util')
,   validator = require('./validator')
;

const Sink = sink.Sink
,   profiles = util.profiles
,   version = package.version
;

/**
 * Build an "options" object based on an HTTP query string.
 *
 * @param {Object} query - an HTTP request query.
 * @returns {Object} an "options" object that can be used by Specberus.
 */

const parseSource = function(query) {
    const result = {};
    if (query.url) result.url = query.url;
    else if (query.source) result.source =uery.source;
    else if (query.file) result.file = query.file;
    else if (query.document) result.document = query.document;
    if (query.profile) {
        if (profiles[query.profile])
            result.profile = profiles[query.profile];
        else
            throw new Error('Cannot retrieve profile “' + query.profile + '”');
    }
    if (query.validation) result.validation = query.validation;
    if (query.processDocument) result.processDocument = query.processDocument;
    return result;
};

/**
 * Handle an API request: parse method and parameters; handle common errors.
 *
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP result.
 */

const parseRequest = function(req, res) {

    if ('/api/version' === req.path) {
        res.status(200).send(version);
    }
    else if ('/api/metadata' === req.path || '/api/validate' === req.path) {
        const validate = ('/api/validate' === req.path)
        ,   options = parseSource(req.query)
        ;
        if (0 === Object.keys(options).length) {
            res.status(400).send('At least one of "url", "source", "file" or "document" must be specified.');
        }
        else {
            var errors = [];
            const v = new validator.Specberus
            ,   handler = new Sink(function(data) {
                    errors.push(data);
                }, function(data) {
                    if (errors.length > 0)
                        res.status(400).send(errors);
                    else if (validate)
                        res.status(200).send(data);
                    else
                        res.status(200).send(v.meta);
                })
            ;
            options.events = handler;
            if (validate)
                v.validate(options);
            else
                v.extractMetadata(options);
        }
    }
    else {
        res.status(400).send('Wrong API method.');
    }

};

const setUp = function(app) {
    app.get('/api/*', parseRequest);
};

exports.setUp = setUp;
