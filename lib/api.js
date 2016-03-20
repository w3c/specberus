/**
 * Specberus REST API.
 */

// Internal packages:
const package = require('../package.json')
,   sink = require('./sink')
,   validator = require('./validator')
;

const Sink = sink.Sink
,   version = package.version
;

/**
 * Build an "options" object based on an HTTP query string.
 *
 * @param {Object} query - an HTTP request query.
 * @returns {Object} an "options" object that can be used by Specberus.
 */

const parseSource = function(query) {
    var result;
    if (query.url) result = {url: query.url};
    else if (query.source) result = {source: query.source};
    else if (query.file) result = {file: query.file};
    else if (query.document) result = {document: query.document};
    return result;
};

/**
 * Handle an API request: parse method and parameters; handle common errors.
 *
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP result.
 */

const parseRequest = function(req, res) {

    var options
    ,   v
    ,   handler
    ;

    if ('/api/version' === req.path) {
        res.status(200).send(version);
    }

    else if (!req.query) {
        res.status(400).send('Missing parameters.');
    }

    else if ('/api/metadata' === req.path) {
        options = parseSource(req.query);
        if (0 === Object.keys(options).length) {
            res.status(400).send('At least one of "url", "source", "file" or "document" must be specified.');
        }
        else {
            v = new validator.Specberus
            handler = new Sink(function(data) {
                res.status(500).send(data);
            }, function(data) {
                res.status(200).send(v.meta);
            })
            ;
            options.events = handler;
            v.extractMetadata(options);
        }
    }

    else if ('/api/validate' === req.path) {
        options = parseSource(req.query);
        if (0 === Object.keys(options).length) {
            res.status(400).send('At least one of "url", "source", "file" or "document" must be specified.');
        }
        else {
            v = new validator.Specberus
            handler = new Sink(function(data) {
                res.status(500).send(data);
            }, function(data) {
                res.status(200).end();
            })
            ;
            options.events = handler;
            v.validate(options);
        }
    }

    else {
        res.status(404).send('Wrong API method.');
    }

};

const setUp = function(app) {
    app.post('/api/*', parseRequest);
};

exports.setUp = setUp;
